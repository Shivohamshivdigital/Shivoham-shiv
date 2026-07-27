"""Tests for the CRM contact mappers (new schema).

Requires Pydantic:  python -m pytest tools/crm/test_mappers.py
"""

from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from tools.crm import (
    ContactLabel,
    ContactMappingError,
    EmailAddress,
    EnterpriseContact,
    Organization,
    PhoneNumber,
    PostalAddress,
    map_contact,
)
from tools.crm.mappers import BaseContactMapper

# --- Sample payloads -------------------------------------------------------

GOOGLE_PERSON = {
    "resourceName": "people/c123456789",
    "names": [
        {"displayName": "Jane Q. Doe", "givenName": "Jane", "familyName": "Doe",
         "metadata": {"primary": True}},
    ],
    "emailAddresses": [
        {"value": "Jane.Doe@Work.com ", "type": "work", "metadata": {"primary": True}},
        {"value": "jane@personal.com", "type": "home"},
        {"value": "not-an-email", "type": "other"},          # dropped
        {"value": "jane@personal.com", "type": "home"},        # duplicate -> deduped
    ],
    "phoneNumbers": [
        {"value": "+1 (555) 010-2020", "type": "cell", "metadata": {"primary": True}},
    ],
    "organizations": [{"name": "Acme Corp", "title": "CTO", "department": "Engineering"}],
    "addresses": [
        {"type": "work", "streetAddress": "1 Market St", "city": "San Francisco",
         "region": "CA", "postalCode": "94105", "country": "USA",
         "formattedValue": "1 Market St, San Francisco, CA 94105"},
    ],
    "birthdays": [{"date": {"year": 1990, "month": 4, "day": 12}}],
    "metadata": {"sources": [{"updateTime": "2026-06-01T10:30:00Z"}]},
}

GRAPH_CONTACT = {
    "id": "AAMkAGI2TG93AAA=",
    "displayName": "John Smith",
    "givenName": "John",
    "surname": "Smith",
    "emailAddresses": [
        {"address": "john.smith@contoso.com", "name": "John Smith"},
        {"address": "jsmith@gmail.com", "name": "John"},
    ],
    "mobilePhone": "+44 20 7946 0000",
    "businessPhones": ["+44 20 7946 1111"],
    "companyName": "Contoso Ltd",
    "jobTitle": "Sales Director",
    "department": "Sales",
    "businessAddress": {"street": "10 Downing St", "city": "London", "state": "",
                         "postalCode": "SW1A 2AA", "countryOrRegion": "United Kingdom"},
    "homeAddress": {},   # empty -> skipped
    "lastModifiedDateTime": "2026-07-20T08:15:00Z",
}


# --- Google People ---------------------------------------------------------

def test_google_core_identity():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert isinstance(c, EnterpriseContact)
    assert c.source_system == "google_people"
    assert c.source_id == "people/c123456789"
    assert (c.first_name, c.last_name) == ("Jane", "Doe")
    assert c.full_name == "Jane Doe"


def test_google_emails_normalised_deduped_single_primary():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert [e.address for e in c.emails] == ["jane.doe@work.com", "jane@personal.com"]
    assert c.primary_email == "jane.doe@work.com"
    assert sum(e.is_primary for e in c.emails) == 1


def test_google_cell_maps_to_mobile():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert c.primary_phone == "+1 (555) 010-2020"
    assert c.phones[0].label is ContactLabel.MOBILE


def test_google_rich_fields():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert c.organizations[0].name == "Acme Corp"
    assert c.addresses[0].city == "San Francisco"
    assert c.source_updated_at == datetime(2026, 6, 1, 10, 30, tzinfo=timezone.utc)


def test_google_display_name_split_fallback():
    c = map_contact("google_people", {
        "resourceName": "people/c1",
        "names": [{"displayName": "Ravi Kumar Nair"}],
    })
    assert (c.first_name, c.last_name) == ("Ravi", "Kumar Nair")


def test_google_missing_resource_name_raises():
    with pytest.raises(ContactMappingError):
        map_contact("google_people", {"names": [{"displayName": "No Id"}]})


# --- Microsoft Graph -------------------------------------------------------

def test_graph_surname_maps_to_last_name():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.source_system == "microsoft_graph"
    assert (c.first_name, c.last_name) == ("John", "Smith")


def test_graph_first_email_primary():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.primary_email == "john.smith@contoso.com"
    assert sum(e.is_primary for e in c.emails) == 1


def test_graph_phone_arrays_and_priority():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.primary_phone == "+44 20 7946 0000"   # mobilePhone surfaced first
    assert c.phones[0].label is ContactLabel.MOBILE
    assert c.phones[1].label is ContactLabel.WORK   # businessPhones


def test_graph_skips_empty_address():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    labels = [a.label for a in c.addresses]
    assert ContactLabel.WORK in labels
    assert ContactLabel.HOME not in labels          # empty homeAddress skipped
    assert c.addresses[0].region is None            # empty state -> None


def test_graph_updated_at():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.source_updated_at == datetime(2026, 7, 20, 8, 15, tzinfo=timezone.utc)


# --- Dispatcher / resilience -----------------------------------------------

def test_unknown_provider_raises():
    with pytest.raises(ContactMappingError):
        map_contact("salesforce", {"id": "1"})


def test_provider_alias_accepted():
    c = map_contact("graph", GRAPH_CONTACT)   # alias -> microsoft_graph
    assert c.source_id == "AAMkAGI2TG93AAA="


def test_missing_source_updated_at_defaults_to_now():
    before = datetime.now(timezone.utc)
    c = map_contact("microsoft_graph", {"id": "x", "givenName": "A", "surname": "B"})
    assert c.source_updated_at >= before


def test_non_dict_record_raises():
    with pytest.raises(ContactMappingError):
        map_contact("google_people", ["not", "a", "dict"])


def test_output_json_serialisable():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert "jane.doe@work.com" in c.model_dump_json()


def test_graph_missing_id_raises():
    with pytest.raises(ContactMappingError):
        map_contact("microsoft_graph", {"givenName": "No", "surname": "Id"})


# --- Validation-error -> ContactMappingError wrapper -----------------------

class _BrokenMapper(BaseContactMapper):
    """A mapper whose hooks emit values the schema rejects (first_name=None),
    forcing a Pydantic ValidationError inside map()."""

    source_system = "broken"

    def _extract_source_id(self, raw):
        return "broken-1"

    def _extract_names(self, raw):
        return (None, None)  # first_name is a required str -> ValidationError


def test_validation_error_maps_to_contact_mapping_error():
    with pytest.raises(ContactMappingError) as excinfo:
        _BrokenMapper().map({})
    # provenance is preserved, and the original ValidationError is chained.
    assert excinfo.value.source_id == "broken-1"
    assert isinstance(excinfo.value.__cause__, ValidationError)


# --- Schema-level invariants (Pydantic) ------------------------------------

def test_schema_contactlabel_is_strenum():
    assert ContactLabel.MOBILE == "mobile"
    assert {c.value for c in ContactLabel} == {"work", "home", "mobile", "other"}


def test_schema_rejects_invalid_email():
    with pytest.raises(ValidationError):
        EmailAddress(address="not-an-email")


def test_schema_email_normalised_lowercased():
    e = EmailAddress(address="  Jane.Doe@Work.COM ")
    assert e.address == "jane.doe@work.com"


def test_schema_phone_rejects_letters():
    with pytest.raises(ValidationError):
        PhoneNumber(number="call-me-maybe")


def test_schema_dedupes_and_resolves_single_primary():
    c = EnterpriseContact(
        source_system="test", source_id="1",
        source_updated_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
        first_name="A", last_name="B",
        emails=[
            EmailAddress(address="a@x.com"),
            EmailAddress(address="a@x.com", is_primary=True),  # dup, primary
            EmailAddress(address="b@x.com", is_primary=True),  # extra primary
        ],
    )
    assert [e.address for e in c.emails] == ["a@x.com", "b@x.com"]
    assert sum(e.is_primary for e in c.emails) == 1
    assert c.primary_email == "a@x.com"   # survivor inherited the primary flag


def test_schema_promotes_first_when_no_primary():
    c = EnterpriseContact(
        source_system="test", source_id="1",
        source_updated_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
        first_name="A", last_name="B",
        phones=[PhoneNumber(number="+1 212 555 0000"), PhoneNumber(number="+1 212 555 1111")],
    )
    assert c.phones[0].is_primary is True
    assert c.primary_phone == "+1 212 555 0000"


def test_schema_postal_and_org_require_a_field():
    with pytest.raises(ValidationError):
        PostalAddress()          # all fields empty
    with pytest.raises(ValidationError):
        Organization()           # all fields empty
    assert PostalAddress(city="London").city == "London"
    assert Organization(name="Acme").name == "Acme"
