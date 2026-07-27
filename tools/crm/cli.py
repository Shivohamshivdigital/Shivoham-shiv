"""Live CLI bridge: raw contact payload on stdin -> EnterpriseContact JSON.

The data gateway for the TypeScript/Next.js backend. It reads one raw provider
payload from ``stdin``, optionally enriches it with phone numbers pulled from an
email signature, maps it to the strict ``EnterpriseContact`` schema, and prints
the validated result as a single clean JSON line to ``stdout``.

Contract
--------
stdin  : one raw JSON object (the provider payload).
stdout : on success, the EnterpriseContact as compact JSON  (exit 0)
         on failure, {"status": "error", "message": "..."}   (exit 1)

Usage
-----
    echo '<google person json>' | python -m tools.crm.cli --provider google_people
    echo '<graph contact json>' | python -m tools.crm.cli --provider graph --extract-signature

Signature enrichment
--------------------
With ``--extract-signature`` the payload is scanned for a plain-text email body
under any of the keys ``body``, ``signature``, ``email_body``, ``text``,
``message``. Phone numbers found in its signature block are injected into the
payload in the provider's native phone field, so the mapper normalises them
alongside the rest of the record.

The Pydantic-backed mapper is imported lazily, so this script starts and handles
stdin / JSON / signature extraction without evaluating Pydantic until the
mapping step itself.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from .signature import extract_signature_phones  # pure standard library

# Local provider-family resolution for signature injection. The mapper remains
# the authority on provider validity; this only picks the injection shape.
_GOOGLE = "google_people"
_GRAPH = "microsoft_graph"
_PROVIDER_ALIASES = {
    "google": _GOOGLE,
    "google_people": _GOOGLE,
    "google_people_api": _GOOGLE,
    "people": _GOOGLE,
    "microsoft": _GRAPH,
    "microsoft_graph": _GRAPH,
    "graph": _GRAPH,
    "msgraph": _GRAPH,
    "outlook": _GRAPH,
}

_BODY_KEYS = ("body", "signature", "email_body", "text", "message")


def _resolve_family(provider: str) -> str:
    key = str(provider).strip().lower()
    return _PROVIDER_ALIASES.get(key, key)


def _emit_error(message: str) -> int:
    """Write the structured error object to stdout and return exit code 1."""
    sys.stdout.write(json.dumps({"status": "error", "message": message}) + "\n")
    return 1


def _apply_signature(provider: str, payload: dict[str, Any]) -> None:
    """Extract phones from the payload's email body and inject them in place.

    Pure standard library — safe to run before Pydantic is imported.
    """
    body = ""
    for key in _BODY_KEYS:
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            body = value
            break
    if not body:
        return

    matches = extract_signature_phones(body)
    if not matches:
        return

    family = _resolve_family(provider)
    if family == _GRAPH:
        business = payload.setdefault("businessPhones", [])
        for m in matches:
            number = m.raw + (f" x{m.extension}" if m.extension else "")
            if m.label == "mobile" and not payload.get("mobilePhone"):
                payload["mobilePhone"] = number
            else:
                business.append(number)
    else:
        # Default to the Google People `phoneNumbers` shape.
        numbers = payload.setdefault("phoneNumbers", [])
        for m in matches:
            number = m.raw + (f" x{m.extension}" if m.extension else "")
            numbers.append({"value": number, "type": m.label})


def _parse_args(argv: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="tools.crm.cli",
        description="Map a raw contact payload (stdin) to EnterpriseContact JSON (stdout).",
    )
    parser.add_argument(
        "--provider",
        required=True,
        help="Source provider: google_people, google, microsoft_graph, graph, ...",
    )
    parser.add_argument(
        "--extract-signature",
        action="store_true",
        help="Extract signature phone numbers from the payload body before mapping.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    raw = sys.stdin.read()

    # --- stdlib stage: read, parse, optionally enrich (no Pydantic needed) ---
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        return _emit_error(f"invalid JSON on stdin: {exc}")
    if not isinstance(payload, dict):
        return _emit_error("stdin payload must be a JSON object")

    if args.extract_signature:
        try:
            _apply_signature(args.provider, payload)
        except Exception as exc:  # never let enrichment crash the gateway
            return _emit_error(f"signature extraction failed: {exc}")

    # --- mapping stage: lazily pull in the Pydantic-backed mapper ---
    try:
        from .mappers import ContactMappingError, map_contact
    except ModuleNotFoundError as exc:
        return _emit_error(f"missing dependency: {exc.name}")

    try:
        contact = map_contact(args.provider, payload)
    except ContactMappingError as exc:
        return _emit_error(str(exc))
    except Exception as exc:  # Pydantic ValidationError and any other fault
        return _emit_error(f"{type(exc).__name__}: {exc}")

    sys.stdout.write(contact.model_dump_json() + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
