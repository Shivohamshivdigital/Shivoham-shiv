# Deploying the CRM Python bridge alongside the Node build

The CRM mapper (`tools/crm/`) is Python + Pydantic; the website and ETL layer are
Node. This guide installs the Python dependencies in production and verifies the
TypeScript → Python bridge end-to-end.

The pieces:

- `scripts/setup-python.mjs` — installs `tools/crm/requirements.txt` (Pydantic).
  Safe as an npm `postinstall`: cross-platform, idempotent, and **never fails the
  build** — if Python/pip are absent it logs and moves on.
- `scripts/verify-pipeline.sh` — end-to-end health check.
- npm scripts: `setup:python`, `postinstall`, `verify:bridge`.

> **The resilience guarantee that makes all of this safe:** the ingestion bridge
> (`tools/etl/contactBridge.ts`) falls back to a pure-JS native mapper whenever
> Python is unavailable. So a missing/incomplete Python install degrades
> gracefully — it never drops a customer record.

---

## 1. Standard servers & containers  ✅ (Python path fully works here)

A persistent Node host (VM, ECS/Fargate, Kubernetes, a self-hosted Next.js
server) can run `python3` at request time, so the full mapper pipeline works.

**Via npm (already wired):** `npm install` runs the `postinstall` hook, which
installs Pydantic automatically. Nothing else to do.

**Explicit deploy step (CI / setup sequence):**

```bash
npm ci
pip install -r tools/crm/requirements.txt   # or: npm run setup:python
npm run build
```

**Dockerfile** — install both toolchains in the image:

```dockerfile
FROM node:22-bookworm

# Python + pip alongside Node
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
COPY tools/crm/requirements.txt tools/crm/requirements.txt
RUN npm ci                                   # postinstall installs Pydantic too
# (or, to be explicit:)  RUN pip install --break-system-packages -r tools/crm/requirements.txt

COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
```

Verify inside the container: `npm run verify:bridge`.

---

## 2. Vercel (serverless)  ⚠️ read this before adding a pip hook

You **can** add the install hook, and it's already wired:

```jsonc
// package.json  (Vercel runs `npm install`, which fires postinstall)
"scripts": {
  "postinstall": "node scripts/setup-python.mjs"
}
```

**But a build-time `pip install` does NOT let a Node serverless function spawn
`python3` at request time.** Vercel's Node Serverless/Edge runtime has no
persistent Python interpreter, and build-installed site-packages are not
available to `child_process.spawn` in the function sandbox. So the spawn bridge
will always take its **native-JS fallback** on Vercel serverless. That is safe
(no dropped records) but means the Python normalisation never actually runs.

Pick one of these instead:

- **A. Do nothing — rely on the native fallback (recommended, zero-config).**
  `contactBridge.ts` already maps Google/Graph payloads in pure JS. Set
  `SKIP_PYTHON_SETUP=1` in the Vercel project env to skip the pointless install.

- **B. Run the Python normaliser as a real Vercel Python Function.** *(implemented)*
  `api/normalize.py` is a Vercel Python function; `api/requirements.txt` lists
  `pydantic`, and `vercel.json` includes `tools/crm/**` so the mapper package is
  importable. Vercel installs the deps into the Python function's own runtime.
  The Node side calls it over **HTTP** instead of spawning:

  ```ts
  await ingestContact(provider, payload, {
    normalizeUrl: 'https://<your-site>/api/normalize',   // uses runHttpBridge
    forward: createBrevoSink(),                          // tools/etl/sinks/brevoSink.ts
  });
  ```

  Request: `POST /api/normalize?provider=google_people[&extract_signature=1]`
  with the raw payload as the body; response is the `EnterpriseContact` JSON (or
  `{"status":"error"}`). If the HTTP call fails, `ingestContact` still falls back
  to the native-JS mapper, so nothing is dropped.

- **C. Move the ingestion endpoint off serverless** onto a persistent Node host
  (section 1), where the spawn bridge works as-is.

If you keep the `postinstall` hook on Vercel, it stays harmless: pip is installed
in the build image or the hook no-ops, and the build never fails.

---

## 3. Verify the pipeline on the target

```bash
npm run verify:bridge
# or:  PYTHON=./.venv/bin/python3 bash scripts/verify-pipeline.sh
```

It checks, in order: `python3` present → `pydantic` importable → a sample Google
payload round-trips through `python -m tools.crm.cli` → the Node↔Python bridge
smoke test (`tools/etl/contactBridge.smoke.ts`). It exits `0` when the Python
path is healthy **or** cleanly degraded to the native fallback, and `1` only when
something is genuinely broken.
