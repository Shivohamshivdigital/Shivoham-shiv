# CRM Contact Integration Utility

Normalises inconsistent contact records from external providers into one
unified, Pydantic-validated **`EnterpriseContact`** schema, and extracts contact
details from plain-text email signatures. Downstream systems only ever see the
unified shape, never a provider's raw payload.

The package is built around a **permissive-in, strict-out** rule: input may be
messy and partial, but anything that validates is clean, de-duplicated, and safe
to persist or forward.

## Package layout

| Module | Purpose | Dependencies |
| --- | --- | --- |
| `schema.py` | The `EnterpriseContact` schema + channel sub-models | Pydantic v2 |
| `mappers.py` | `GooglePeopleMapper`, `MicrosoftGraphMapper`, `map_contact` | Pydantic v2 |
| `signature.py` | Signature-block detection + phone extraction | **pure stdlib** |
| `__init__.py` | Lazy package entry point (see below) | — |

### Lazy loading

`__init__.py` uses PEP 562 (`__getattr__`/`__dir__`) so the two tiers stay
isolated:

- **Eager** — `extract_signature_phones` (and the rest of the stdlib signature
  surface) is imported directly, available with zero overhead and no third-party
  wheels. Importing the package, or touching these helpers, **never evaluates
  Pydantic**.
- **Lazy** — `schema`, `mappers`, and `map_contact` are deferred until first
  access, so environments without Pydantic can still use the signature tools.

```python
from tools.crm import extract_signature_phones   # eager, no Pydantic imported
from tools.crm import map_contact                 # loads Pydantic on first access
```

## Install

Only the schema/mappers and the test harness need external packages; the
signature module needs nothing.

```bash
pip install -r tools/crm/requirements.txt        # pydantic>=2.0.0, pytest
```

Requires Python 3.11+ (uses `StrEnum` and PEP 604 unions).

## Mapping contacts — `map_contact`

```python
from tools.crm import map_contact

contact = map_contact("google_people", raw_google_person)
contact = map_contact("microsoft_graph", raw_graph_contact)   # alias: "graph"

contact.first_name      # "Jane"
contact.last_name       # "Doe"
contact.full_name       # "Jane Doe"
contact.primary_email   # "jane.doe@work.com"  (always predictable)
contact.primary_phone   # "+1 (555) 010-2020"
contact.model_dump()        # plain dict, ready to persist
contact.model_dump_json()   # JSON string
```

Supported providers:

| Provider | `provider_name` (+ aliases) | Input shape |
| --- | --- | --- |
| Google People API | `google_people` (`google`, `people`) | [`Person`](https://developers.google.com/people/api/rest/v1/people#Person) |
| Microsoft Graph API | `microsoft_graph` (`graph`, `msgraph`, `outlook`) | [`contact`](https://learn.microsoft.com/en-us/graph/api/resources/contact) |

The `EnterpriseContact` model carries provenance (`source_system`, `source_id`,
`source_updated_at`), core identity (`first_name`, `last_name`), and typed lists
of `emails`, `phones`, `addresses`, and `organizations`. Emails and phones are
de-duplicated and resolved to exactly one `is_primary` each.

### Resilience

`map_contact` is defensive. Invalid individual values (a garbage email, an empty
organization) are logged and dropped rather than sinking the record. Only two
things raise the custom `ContactMappingError`:

- an **unknown provider**, or
- a record with **no resolvable identity** (missing `resourceName` / `id`), or
  one that fails schema validation — the underlying `ValidationError` is caught
  and re-raised as `ContactMappingError` with `.provider` and `.source_id`.

```python
from tools.crm import map_contact, ContactMappingError

for raw in api_records:
    try:
        persist(map_contact("microsoft_graph", raw))
    except ContactMappingError as exc:
        logger.warning("skipped %s record %s: %s", exc.provider, exc.source_id, exc)
```

## Signature phone extraction — zero dependencies

`signature.py` pulls phone numbers out of the **signature block** of a
plain-text email. Pure standard library, so it runs in any isolated runtime.

```python
from tools.crm import extract_signature_phones

for m in extract_signature_phones(sent_email_body):
    print(m.label, m.raw, m.digits, m.extension)
    # mobile  +91 98765 43210  +919876543210  None
    # work    (415) 555-0142   4155550142     227
```

- `find_signature_block(text) -> str` — locates the signature (RFC 3676 `--`
  delimiter → sign-off line → strict trailing-lines fallback); `""` if none.
- `extract_phone_numbers(text) -> list[PhoneMatch]` — regex capture validated to
  7–15 digits (E.164), **rejecting dates, ZIP codes, and short/long IDs**, with
  extensions (`x44`, `ext. 102`) parsed out and duplicates removed.
- `extract_signature_phones(body, fallback_to_body=False)` — the main interface:
  scopes to the signature by default (returns `[]` when none found); pass
  `fallback_to_body=True` to scan the whole message.

Bridge results into the schema (this call needs Pydantic):

```python
from tools.crm import extract_signature_phones, phone_matches_to_schema
phones = phone_matches_to_schema(extract_signature_phones(body))   # list[PhoneNumber]
```

## Tests

```bash
# Mapper + schema tests (require Pydantic)
python -m pytest tools/crm/test_mappers.py -v

# Signature tests — pure stdlib, run with or without pytest
python -m pytest tools/crm/test_signature.py -v
python tools/crm/test_signature.py            # built-in runner, no pytest needed
```
