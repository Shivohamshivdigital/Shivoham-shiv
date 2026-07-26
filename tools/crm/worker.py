"""Stdin/stdout JSON transform worker for the ETL pipeline.

A long-lived, streaming worker: the Node orchestration layer spawns it once,
pushes un-normalised records as NDJSON on ``stdin``, and reads normalised
records back as NDJSON on ``stdout``. Structured telemetry (never data) goes to
``stderr``. This keeps the IPC contract line-oriented and back-pressure friendly
for high throughput — one long process, not one spawn per record.

Wire protocol
-------------
stdin   : one raw JSON object per line (NDJSON). Blank lines are ignored.
stdout  : one result object per input line, in order:
            {"ok": true,  "index": i, "data": {...normalised...}}
            {"ok": false, "index": i, "error": {"kind": "...", "message": "..."}}
stderr  : NDJSON telemetry, e.g.
            {"level":"info","event":"start","transform":"signature"}
            {"level":"error","event":"record_failed","index":3,"kind":"validation"}
            {"level":"info","event":"done","processed":10,"failed":1}
exit    : 0  ran to completion (per-record failures are reported in-band)
          2  fatal: unknown transform / bad arguments
          3  fatal: a required dependency is missing (e.g. pydantic)

Usage
-----
    python -m tools.crm.worker --transform signature
    python -m tools.crm.worker --transform map_contact --source google_people
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any, Callable, Iterable

# A transform takes one raw dict and returns a JSON-serialisable normalised
# value. It may raise; the driver isolates per-record failures.
Transform = Callable[[dict[str, Any]], Any]


def _telemetry(stream, **fields: Any) -> None:
    """Emit one NDJSON telemetry line to stderr and flush."""
    stream.write(json.dumps(fields, separators=(",", ":")) + "\n")
    stream.flush()


def _build_signature_transform() -> Transform:
    """Extract signature phone numbers from a record's text field.

    Input record: {"id": "...", "body": "<plain-text email>"}
    Output: {"id": "...", "phones": [{"raw","digits","label","extension"}, ...]}

    Pure standard library — always available.
    """
    from .signature import extract_signature_phones

    def transform(record: dict[str, Any]) -> Any:
        body = record.get("body") or record.get("text") or ""
        matches = extract_signature_phones(body)
        return {
            "id": record.get("id"),
            "phones": [
                {
                    "raw": m.raw,
                    "digits": m.digits,
                    "label": m.label,
                    "extension": m.extension,
                }
                for m in matches
            ],
        }

    return transform


def _build_map_contact_transform(default_source: str | None) -> Transform:
    """Normalise a provider contact into the unified EnterpriseContact schema.

    Input record: the raw provider payload, optionally wrapped as
    {"source": "google_people", "payload": {...}}. Requires pydantic.
    """
    # Import eagerly so a missing dependency fails fast at startup (exit 3),
    # letting the orchestrator fall back cleanly rather than per-record.
    from .mappers import map_contact

    def transform(record: dict[str, Any]) -> Any:
        source = record.get("source", default_source)
        payload = record.get("payload", record)
        if not source:
            raise ValueError("record has no 'source' and no --source default was given")
        return map_contact(source, payload).model_dump(mode="json")

    return transform


def _select_transform(name: str, source: str | None) -> Transform:
    if name == "signature":
        return _build_signature_transform()
    if name == "map_contact":
        return _build_map_contact_transform(source)
    raise KeyError(name)


def _classify_error(exc: BaseException) -> str:
    module = type(exc).__module__ or ""
    if module.startswith("pydantic"):
        return "validation"
    if isinstance(exc, (ValueError, KeyError)):
        return "mapping"
    return "runtime"


def run(lines: Iterable[str], transform: Transform, out, err) -> int:
    """Drive the transform over NDJSON ``lines``. Returns the exit code."""
    processed = 0
    failed = 0
    for index, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
            if not isinstance(record, dict):
                raise ValueError(f"expected a JSON object, got {type(record).__name__}")
            data = transform(record)
            out.write(json.dumps({"ok": True, "index": index, "data": data},
                                 separators=(",", ":")) + "\n")
            out.flush()
            processed += 1
        except Exception as exc:  # per-record isolation — never abort the stream
            failed += 1
            kind = "serialization" if isinstance(exc, json.JSONDecodeError) else _classify_error(exc)
            out.write(json.dumps(
                {"ok": False, "index": index, "error": {"kind": kind, "message": str(exc)}},
                separators=(",", ":")) + "\n")
            out.flush()
            _telemetry(err, level="error", event="record_failed", index=index, kind=kind)
    _telemetry(err, level="info", event="done", processed=processed, failed=failed)
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Streaming JSON transform worker.")
    parser.add_argument("--transform", required=True, choices=["signature", "map_contact"])
    parser.add_argument("--source", default=None,
                        help="Default source system for --transform map_contact.")
    args = parser.parse_args(argv)

    try:
        transform = _select_transform(args.transform, args.source)
    except KeyError:
        _telemetry(sys.stderr, level="error", event="fatal",
                   reason="unknown_transform", transform=args.transform)
        return 2
    except ModuleNotFoundError as exc:
        _telemetry(sys.stderr, level="error", event="fatal",
                   reason="missing_dependency", dependency=exc.name)
        return 3

    _telemetry(sys.stderr, level="info", event="start", transform=args.transform)
    return run(sys.stdin, transform, sys.stdout, sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
