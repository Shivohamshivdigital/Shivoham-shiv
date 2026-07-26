"""Tests for the CRM contact mappers.

Run with:  python -m pytest tools/crm/test_mappers.py
"""

from datetime import date, datetime, timezone

import pytest

from tools.crm import (
    ContactLabel,
    ContactMappingError,
    EnterpriseContact,
    SourceSystem,
    map_contact,
)

# --- Sample payloads -------------------------------------------------------

GOOGLE_PERSON = {
    "resourceName": "people/c123456789",
    "names": [
        {
            "displayName": "Jane Q. Doe",
            "givenName": "Jane",
            "familyName": "Doe",
            "metadata": {"primary": True},
        }
    ],
    "emailAddresses": [
        {"value": "Jane.Doe@Work.com ", "type": "work", "metadata": {"primary": True}},
        {"value": "jane@personal.com", "type": "home"},
        {"value": "not-an-email", "type": "other"},  # dropped
        {"value": "jane@personal.com", "type": "home"},  # duplicate, deduped
    ],
    "phoneNumbers": [
        {"value": "+1 (555) 010-2020", "type": "mobile", "metadata": {"primary": True}},
    ],
    "organizations": [{"name": "Acme Corp", "title": "CTO", "department": "Engineering"}],
    "addresses": [
        {
            "type": "work",
            "streetAddress": "1 Market St",
            "city": "San Francisco",
            "region": "CA",
            "postalCode": "94105",
            "country": "USA",
            "formattedValue": "1 Market St, San Francisco, CA 94105",
        }
    ],
    "photos": [{"url": "https://example.com/jane.jpg", "metadata": {"primary": True}}],
    "birthdays": [{"date": {"year": 1990, "month": 4, "day": 12}}],
    "biographies": [{"value": "Met at conference.", "metadata": {"primary": True}}],
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
    "businessAddress": {
        "street": "10 Downing St",
        "city": "London",
        "state": "",
        "postalCode": "SW1A 2AA",
        "countryOrRegion": "United Kingdom",
    },
    "homeAddress": {},  # empty -> skipped
    "personalNotes": "Key account.",
    "birthday": "1985-11-23T00:00:00Z",
    "lastModifiedDateTime": "2026-07-20T08:15:00Z",
}


# --- Google People ---------------------------------------------------------

def test_google_maps_core_identity():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert isinstance(c, EnterpriseContact)
    assert c.source_system is SourceSystem.GOOGLE_PEOPLE
    assert c.source_id == "people/c123456789"
    assert c.display_name == "Jane Q. Doe"
    assert c.given_name == "Jane"
    assert c.family_name == "Doe"


def test_google_normalises_and_dedupes_emails():
    c = map_contact("google_people", GOOGLE_PERSON)
    addresses = [e.address for e in c.emails]
    # lowercased + trimmed, invalid dropped, duplicate removed
    assert addresses == ["jane.doe@work.com", "jane@personal.com"]
    assert c.primary_email == "jane.doe@work.com"
    assert sum(e.primary for e in c.emails) == 1


def test_google_maps_rich_fields():
    c = map_contact("google_people", GOOGLE_PERSON)
    assert c.primary_phone == "+1 (555) 010-2020"
    assert c.phones[0].label is ContactLabel.MOBILE
    assert c.organizations[0].name == "Acme Corp"
    assert c.organizations[0].title == "CTO"
    assert c.addresses[0].city == "San Francisco"
    assert c.photo_url == "https://example.com/jane.jpg"
    assert c.birthday == date(1990, 4, 12)
    assert c.notes == "Met at conference."
    assert c.source_updated_at == datetime(2026, 6, 1, 10, 30, tzinfo=timezone.utc)


def test_google_missing_resource_name_raises():
    with pytest.raises(ContactMappingError):
        map_contact("google_people", {"names": [{"displayName": "No Id"}]})


def test_google_display_name_falls_back_to_email_local_part():
    c = map_contact(
        "google_people",
        {
            "resourceName": "people/c1",
            "emailAddresses": [{"value": "solo@x.com", "metadata": {"primary": True}}],
        },
    )
    assert c.display_name == "solo"


# --- Microsoft Graph -------------------------------------------------------

def test_graph_maps_core_identity():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.source_system is SourceSystem.MICROSOFT_GRAPH
    assert c.source_id == "AAMkAGI2TG93AAA="
    assert c.display_name == "John Smith"
    assert c.family_name == "Smith"  # from "surname"


def test_graph_first_email_is_primary():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.primary_email == "john.smith@contoso.com"
    assert sum(e.primary for e in c.emails) == 1


def test_graph_phone_priority_and_labels():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    # mobile surfaces first and becomes primary
    assert c.primary_phone == "+44 20 7946 0000"
    assert c.phones[0].label is ContactLabel.MOBILE
    assert c.phones[1].label is ContactLabel.WORK


def test_graph_skips_empty_address():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    labels = [a.label for a in c.addresses]
    assert ContactLabel.WORK in labels
    assert ContactLabel.HOME not in labels  # empty homeAddress skipped
    assert c.addresses[0].region is None  # empty state -> None, not ""


def test_graph_org_notes_dates():
    c = map_contact("microsoft_graph", GRAPH_CONTACT)
    assert c.organizations[0].name == "Contoso Ltd"
    assert c.notes == "Key account."
    assert c.birthday == date(1985, 11, 23)
    assert c.source_updated_at == datetime(2026, 7, 20, 8, 15, tzinfo=timezone.utc)


# --- Dispatch / errors -----------------------------------------------------

def test_unknown_source_raises():
    with pytest.raises(ContactMappingError):
        map_contact("salesforce", {"id": "1"})


def test_accepts_enum_source():
    c = map_contact(SourceSystem.MICROSOFT_GRAPH, GRAPH_CONTACT)
    assert c.source_id == "AAMkAGI2TG93AAA="


def test_non_dict_record_raises():
    with pytest.raises(ContactMappingError):
        map_contact("google_people", ["not", "a", "dict"])


def test_output_is_json_serialisable():
    c = map_contact("google_people", GOOGLE_PERSON)
    dumped = c.model_dump_json()
    assert "jane.doe@work.com" in dumped
