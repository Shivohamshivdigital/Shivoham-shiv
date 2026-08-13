"""Test fixture: stands in for tools/crm/cli.py emitting an in-band error.

Always prints the {"status": "error", ...} object (exit 0) to exercise the
bridge's cli-error -> native-fallback path.
"""

import json
import sys

sys.stdin.read()
print(json.dumps({"status": "error", "message": "forced fixture error"}))
