#!/usr/bin/env bash
#
# Confirm the TypeScript -> Python pipeline bridge works on this deployment
# target. Safe to run in CI or on a booted server.
#
#   bash scripts/verify-pipeline.sh          # uses python3
#   PYTHON=./.venv/bin/python3 bash scripts/verify-pipeline.sh
#
# Exit 0 = pipeline healthy (Python path works) OR cleanly degraded (Python
#          absent, native-JS fallback confirmed). Exit 1 = broken.

set -u
PY="${PYTHON:-python3}"
echo "== CRM TS->Python pipeline verification =="

# 1) Python present?
if ! command -v "$PY" >/dev/null 2>&1; then
  echo "note: '$PY' not found → the bridge runs in native-JS fallback mode."
  PY=""
fi
[ -n "$PY" ] && echo "python : $("$PY" --version 2>&1)"

# 2) Pydantic importable?
PYDANTIC_OK=0
if [ -n "$PY" ] && "$PY" -c "import pydantic" >/dev/null 2>&1; then
  PYDANTIC_OK=1
  echo "pydantic: $("$PY" -c 'import pydantic; print(pydantic.__version__)')"
else
  echo "pydantic: not importable (run: $PY -m pip install -r tools/crm/requirements.txt)"
fi

# 3) Round-trip a sample Google payload through the CLI gateway.
SAMPLE='{"resourceName":"people/c1","names":[{"givenName":"Jane","familyName":"Doe"}],"emailAddresses":[{"value":"Jane@Work.com","type":"work","metadata":{"primary":true}}]}'
if [ -n "$PY" ]; then
  OUT="$(printf '%s' "$SAMPLE" | PYTHONPATH=. "$PY" -m tools.crm.cli --provider google_people)"
  CODE=$?
  echo "cli.py exit=$CODE"
  echo "cli.py out : $OUT"
  if [ "$PYDANTIC_OK" = "1" ]; then
    if [ "$CODE" -eq 0 ] && printf '%s' "$OUT" | grep -q '"first_name":"Jane"'; then
      echo "PASS: Python mapper pipeline is healthy."
    else
      echo "FAIL: expected a valid EnterpriseContact from cli.py."; exit 1
    fi
  else
    if printf '%s' "$OUT" | grep -q '"status": "error"'; then
      echo "OK (degraded): cli.py reported the missing dependency cleanly."
    else
      echo "FAIL: unexpected cli.py output without pydantic."; exit 1
    fi
  fi
fi

# 4) Node -> Python bridge end-to-end (uses the native-JS fallback when Python
#    is unavailable, so it must pass on every target).
if command -v node >/dev/null 2>&1; then
  echo "-- node bridge smoke --"
  if node tools/etl/contactBridge.smoke.ts >/tmp/bridge_smoke.$$ 2>&1; then
    tail -1 /tmp/bridge_smoke.$$
    echo "PASS: TS->Python bridge (with fallback) verified."
  else
    tail -20 /tmp/bridge_smoke.$$
    rm -f /tmp/bridge_smoke.$$
    echo "FAIL: bridge smoke test failed."; exit 1
  fi
  rm -f /tmp/bridge_smoke.$$
else
  echo "note: node not found → skipped the TS bridge smoke."
fi

echo "== verification complete =="
exit 0
