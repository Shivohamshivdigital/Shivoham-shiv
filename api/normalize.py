"""Vercel Python Serverless Function: normalise a raw contact payload.

The working way to run the Pydantic mapper on Vercel (a Node serverless function
cannot spawn python3, but Vercel's Python runtime can host this directly). The
Node/ETL side calls it over HTTP instead of `child_process.spawn`.

    POST /api/normalize?provider=google_people[&extract_signature=1]
    body: the raw provider payload (JSON object)

    200 -> the validated EnterpriseContact as JSON
    4xx -> {"status": "error", "message": "..."}

Vercel installs api/requirements.txt (pydantic) into this function's runtime;
vercel.json includes tools/crm/** so the mapper package is importable.
"""

from __future__ import annotations

import json
import os
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Make the repo root importable so `tools.crm` resolves inside the function.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Pure-stdlib helper (no pydantic) for the optional signature enrichment.
from tools.crm.cli import _apply_signature  # noqa: E402


def normalize(provider: str, payload, extract_signature: bool = False):
    """Core logic, HTTP-independent so it is unit-testable.

    Returns ``(status_code, body_dict)``.
    """
    if not isinstance(payload, dict):
        return 400, {"status": "error", "message": "payload must be a JSON object"}
    if not provider:
        return 400, {"status": "error", "message": "missing provider"}

    if extract_signature:
        try:
            _apply_signature(provider, payload)
        except Exception as exc:  # never let enrichment fail the request
            return 422, {"status": "error", "message": f"signature extraction failed: {exc}"}

    try:
        from tools.crm.mappers import ContactMappingError, map_contact
    except ModuleNotFoundError as exc:
        return 500, {"status": "error", "message": f"missing dependency: {exc.name}"}

    try:
        contact = map_contact(provider, payload)
    except ContactMappingError as exc:
        return 422, {"status": "error", "message": str(exc)}
    except Exception as exc:  # pydantic ValidationError and anything else
        return 422, {"status": "error", "message": f"{type(exc).__name__}: {exc}"}

    return 200, json.loads(contact.model_dump_json())


class handler(BaseHTTPRequestHandler):
    def do_POST(self):  # noqa: N802 (Vercel/BaseHTTPRequestHandler contract)
        try:
            length = int(self.headers.get("content-length", 0) or 0)
            raw = self.rfile.read(length).decode("utf-8") if length else ""
            query = parse_qs(urlparse(self.path).query)
            provider = (query.get("provider", [""])[0] or "").strip()
            extract_signature = (query.get("extract_signature", ["0"])[0] or "").lower() in (
                "1", "true", "yes",
            )
            try:
                payload = json.loads(raw) if raw else {}
            except json.JSONDecodeError as exc:
                return self._respond(400, {"status": "error", "message": f"invalid JSON: {exc}"})

            status, body = normalize(provider, payload, extract_signature)
            self._respond(status, body)
        except Exception as exc:  # last-resort guard
            self._respond(500, {"status": "error", "message": f"{type(exc).__name__}: {exc}"})

    def _respond(self, status: int, body: dict) -> None:
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
