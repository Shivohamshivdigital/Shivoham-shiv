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
python -m pytest tools/crm/test_mappers.py -v
```
