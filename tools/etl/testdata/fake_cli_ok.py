"""Test fixture: stands in for tools/crm/cli.py on the success path.

Reads (and ignores) stdin, then prints a canned EnterpriseContact JSON matching
the --provider family. Pure stdlib so it runs without Pydantic. Used by
contactBridge.smoke.ts to exercise the happy path where Python is available.
"""

import json
import sys

argv = sys.argv[1:]
provider = argv[argv.index("--provider") + 1] if "--provider" in argv else ""
sys.stdin.read()  # drain stdin like the real CLI

family = (
    "microsoft_graph"
    if provider.lower() in ("graph", "microsoft_graph", "msgraph", "outlook", "microsoft")
    else "google_people"
)
print(json.dumps({
    "source_system": family,
    "source_id": "fixture-1",
    "source_updated_at": "2026-01-01T00:00:00Z",
    "first_name": "Jane",
    "last_name": "Doe",
    "emails": [{"address": "jane@work.com", "label": "work", "is_primary": True}],
    "phones": [],
    "addresses": [],
    "organizations": [],
}))
