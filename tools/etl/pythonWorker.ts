/**
 * Structured IPC helper: stream JSON through a local Python worker.
 *
 * Spawns the worker once, pushes un-normalised records as NDJSON on `stdin`,
 * and streams normalised records back as NDJSON on `stdout`. `stderr` carries
 * structured telemetry only. The helper is an *absolute isolation boundary*:
 * it never throws and never rejects. A spawn failure, non-zero exit, timeout,
 * buffer overflow, or protocol error is captured and returned as a typed
 * failure — the parent event loop is never interrupted.
 *
 * Runtime: plain Node (>=18). No third-party dependencies. Written to be
 * type-strippable, so `node tools/etl/pythonWorker.ts` runs as-is.
 */

import { spawn } from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';

// ---- Public result types --------------------------------------------------

/** Why a whole worker run failed (as opposed to a single record). */
export type WorkerFailureKind =
  | 'spawn' // executable not found / could not start
  | 'timeout' // exceeded timeoutMs, process was killed
  | 'nonzero-exit' // process exited with a non-zero code
  | 'buffer-overflow' // stdout exceeded maxBufferBytes, process was killed
  | 'protocol'; // stdout was not the expected NDJSON envelope

/** Per-record success envelope emitted by the worker on stdout. */
export interface RecordOk<TOut> {
  ok: true;
  index: number;
  data: TOut;
}

/** Per-record failure envelope (isolated by the worker; the stream continues). */
export interface RecordErr {
  ok: false;
  index: number;
  error: { kind: string; message: string };
}

export type RecordResult<TOut> = RecordOk<TOut> | RecordErr;

/** Diagnostics captured for every run, success or failure. */
export interface WorkerTelemetry {
  command: string;
  args: string[];
  durationMs: number;
  exitCode: number | null;
  signal: string | null;
  timedOut: boolean;
  bytesOut: number;
  stderr: string[]; // raw NDJSON telemetry lines from the worker
}

export interface WorkerRunOk<TOut> {
  ok: true;
  results: RecordResult<TOut>[];
  telemetry: WorkerTelemetry;
}

export interface WorkerRunErr {
  ok: false;
  kind: WorkerFailureKind;
  message: string;
  results: RecordResult<unknown>[]; // any records parsed before the failure
  telemetry: WorkerTelemetry;
}

export type WorkerRun<TOut> = WorkerRunOk<TOut> | WorkerRunErr;

// ---- Options --------------------------------------------------------------

export interface SpawnWorkerOptions {
  /** Python executable. Default: `python3`. */
  command?: string;
  /** Worker module args, e.g. `['-m', 'tools.crm.worker', '--transform', 'signature']`. */
  args?: string[];
  /** Hard wall-clock limit; the process is SIGKILLed past it. Default: 5000ms. */
  timeoutMs?: number;
  /** Kill the process if stdout grows past this. Default: 10 MiB. */
  maxBufferBytes?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  /** Called for each stderr telemetry line as it arrives. */
  onTelemetry?: (line: string) => void;
  /** Sink for the helper's own warnings. Default: `console`. */
  logger?: Pick<Console, 'warn' | 'error' | 'debug'>;
}

const DEFAULTS = {
  command: 'python3',
  timeoutMs: 5000,
  maxBufferBytes: 10 * 1024 * 1024,
};

// ---- Helper ---------------------------------------------------------------

/**
 * Run `records` through the Python worker and collect the normalised results.
 * Always resolves — inspect `.ok` to branch. Never throws.
 */
export function runPythonWorker<TIn, TOut>(
  records: TIn[],
  options: SpawnWorkerOptions = {},
): Promise<WorkerRun<TOut>> {
  const command = options.command ?? DEFAULTS.command;
  const args = options.args ?? [];
  const timeoutMs = options.timeoutMs ?? DEFAULTS.timeoutMs;
  const maxBufferBytes = options.maxBufferBytes ?? DEFAULTS.maxBufferBytes;
  const logger = options.logger ?? console;
  const startedAt = Date.now();

  return new Promise<WorkerRun<TOut>>((resolve) => {
    const results: RecordResult<TOut>[] = [];
    const stderrLines: string[] = [];
    let stdoutRest = '';
    let stderrRest = '';
    let bytesOut = 0;
    let settled = false;
    let timedOut = false;
    let overflow = false;
    let exitCode: number | null = null;
    let exitSignal: string | null = null;

    const telemetry = (): WorkerTelemetry => ({
      command,
      args,
      durationMs: Date.now() - startedAt,
      exitCode,
      signal: exitSignal,
      timedOut,
      bytesOut,
      stderr: stderrLines,
    });

    const settle = (run: WorkerRun<TOut>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(run);
    };

    const fail = (kind: WorkerFailureKind, message: string) =>
      settle({ ok: false, kind, message, results, telemetry: telemetry() });

    // --- spawn (guard synchronous failures) ---
    let child: ChildProcessWithoutNullStreams;
    try {
      child = spawn(command, args, {
        cwd: options.cwd,
        env: options.env ?? process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      return fail('spawn', `spawn threw: ${String(err)}`);
    }

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    // Do not keep the event loop alive purely for this timer.
    if (typeof timer.unref === 'function') timer.unref();

    // --- stdin: push records as NDJSON, then close ---
    // Guard EPIPE: the child may die before we finish writing.
    child.stdin.on('error', (err) => {
      logger.debug?.(`[pythonWorker] stdin error (ignored): ${String(err)}`);
    });
    try {
      for (const record of records) {
        child.stdin.write(JSON.stringify(record) + '\n');
      }
      child.stdin.end();
    } catch (err) {
      logger.debug?.(`[pythonWorker] stdin write failed: ${String(err)}`);
    }

    // --- stdout: parse NDJSON envelopes as they stream in ---
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      bytesOut += Buffer.byteLength(chunk, 'utf8');
      if (bytesOut > maxBufferBytes && !overflow) {
        overflow = true;
        child.kill('SIGKILL');
        return;
      }
      stdoutRest += chunk;
      const lines = stdoutRest.split('\n');
      stdoutRest = lines.pop() ?? '';
      for (const line of lines) pushResultLine(line);
    });

    // --- stderr: structured telemetry only ---
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderrRest += chunk;
      const lines = stderrRest.split('\n');
      stderrRest = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        stderrLines.push(trimmed);
        options.onTelemetry?.(trimmed);
      }
    });

    // --- process-level failure ---
    child.on('error', (err) => {
      // ENOENT etc. — the executable could not be started.
      fail('spawn', `child error: ${String(err)}`);
    });

    // --- completion ---
    child.on('close', (code, signal) => {
      exitCode = code;
      exitSignal = signal;
      // Flush any trailing partial lines.
      if (stdoutRest.trim()) pushResultLine(stdoutRest);
      if (stderrRest.trim()) {
        stderrLines.push(stderrRest.trim());
        options.onTelemetry?.(stderrRest.trim());
      }

      if (timedOut) return fail('timeout', `worker exceeded ${timeoutMs}ms`);
      if (overflow) return fail('buffer-overflow', `stdout exceeded ${maxBufferBytes} bytes`);
      if (code !== 0) return fail('nonzero-exit', `worker exited with code ${code}`);
      settle({ ok: true, results, telemetry: telemetry() });
    });

    function pushResultLine(line: string) {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        results.push(JSON.parse(trimmed) as RecordResult<TOut>);
      } catch {
        // A stdout line that is not valid JSON is a protocol violation, but we
        // record it as a per-record protocol error and keep going rather than
        // discarding the whole batch.
        results.push({
          ok: false,
          index: -1,
          error: { kind: 'protocol', message: `unparseable worker line: ${trimmed.slice(0, 160)}` },
        });
      }
    }
  });
}
