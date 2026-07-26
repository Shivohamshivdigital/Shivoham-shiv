# CRM Contact Mapping Utility

Normalises inconsistent contact records from external providers into one
unified, Pydantic-validated **enterprise contact schema**. Downstream systems
(our leads database, Brevo sync, analytics) only ever see the unified shape,
never a provider's raw payload.

Supported sources today:

| Source              | `source` key        | Input shape                                   |
| ------------------- | ------------------- | --------------------------------------------- |
| Google People API   | `google_people`     | [`Person`](https://developers.google.com/people/api/rest/v1/people#Person) resource |
| Microsoft Graph API | `microsoft_graph`   | [`contact`](https://learn.microsoft.com/en-us/graph/api/resources/contact) resource |

## Install

```bash
pip install -r tools/crm/requirements.txt
```

Requires Python 3.10+ (uses PEP 604 `X | Y` and built-in generics).

## Usage

```python
from tools.crm import map_contact

# One record from an upstream API response
contact = map_contact("google_people", raw_person)
contact = map_contact("microsoft_graph", raw_graph_contact)

print(contact.display_name)   # "Jane Q. Doe"
print(contact.primary_email)  # "jane.doe@work.com"
print(contact.model_dump())   # plain dict, ready to persist
print(contact.model_dump_json())
```

You can also use a concrete mapper directly:

```python
from tools.crm import GooglePeopleMapper

mapper = GooglePeopleMapper()
contacts = [mapper.map(person) for person in api_response["connections"]]
```

## Signature phone extraction

`signature.py` pulls phone numbers out of the **signature block** of a
plain-text email — for logging contacts from a rep's own sent mail. It is **pure
standard library** (no Pydantic needed), so it runs anywhere.

```python
from tools.crm import extract_signature_phones

for match in extract_signature_phones(sent_email_body):
    print(match.label, match.raw, match.digits, match.extension)
    # e.g.  mobile  +91 98765 43210  +919876543210  None
    #       work    (212) 555-1000   2125551000     44
```

How it works:

- **Locates the signature** by, strongest signal first: an `--` delimiter line
  (RFC 3676), a sign-off line ("Best regards", "Thanks", ...), or a strict
  trailing-lines fallback that only fires on a real contact signal.
- **Scopes extraction to that block** so body text (invoice ids, dates, "call
  within 24 hours") does not produce phone-shaped false positives.
- **Validates by digit count** (7–15, per E.164) and reads a preceding label
  ("Mobile:", "T.", "Direct") to classify each number; extensions (`x227`,
  `ext. 227`) are parsed out; duplicates are removed.
- When **no signature is found it returns `[]`** — safer than guessing. Pass
  `extract_signature_phones(text, fallback_to_body=True)` to scan the whole
  message and accept the false-positive risk.

Bridge the results into the unified schema (requires Pydantic):

```python
from tools.crm import extract_signature_phones, phone_matches_to_schema

phones = phone_matches_to_schema(extract_signature_phones(sent_email_body))
# -> list[PhoneNumber], ready to attach to an EnterpriseContact
```

## Design

- **Permissive in, strict out.** Upstream payloads are partial and occasionally
  malformed. A single bad field (e.g. a garbage email) is logged and dropped
  rather than allowed to fail the whole record; but any `EnterpriseContact` that
  is returned is fully validated and safe to persist.
- **Normalised labels.** Provider vocabularies ("work"/"business",
  "mobile"/"cell") collapse onto a small stable `ContactLabel` enum.
- **Guaranteed invariants.** Emails and phones are de-duplicated and carry
  exactly one `primary`, so `contact.primary_email` is always well-defined.
- **Provenance preserved.** Every contact keeps `source_system`, `source_id`,
  and `source_updated_at` for idempotent upserts and incremental syncs.
- **Extensible.** Add a provider by subclassing `BaseContactMapper`,
  implementing the `_extract_*` hooks, and registering it in `mappers._MAPPERS`.

### Error handling

`map_contact` raises `ContactMappingError` (a `ValueError` subclass) for an
unknown source or an unmappable record. It carries `.source` and `.source_id`
so an ingestion pipeline can log and skip the offending record precisely:

```python
from tools.crm import map_contact, ContactMappingError

for raw in api_records:
    try:
        upsert(map_contact("microsoft_graph", raw))
    except ContactMappingError as exc:
        logger.warning("skipped %s record %s: %s", exc.source, exc.source_id, exc)
```

## Tests

```bash
# Mapper tests require Pydantic
python -m pytest tools/crm/test_mappers.py -v

# Signature tests are pure stdlib and run with or without pytest
python -m pytest tools/crm/test_signature.py -v
python tools/crm/test_signature.py            # built-in runner, no pytest needed
```
