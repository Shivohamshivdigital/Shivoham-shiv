"""CRM contact-normalisation utility.

Maps inconsistent contact records from external providers (Google People API,
Microsoft Graph API) into one unified, Pydantic-validated
:class:`EnterpriseContact` schema, and extracts contact details from the
signature blocks of plain-text emails.

    from tools.crm import map_contact, extract_signature_phones

    contact = map_contact("google_people", raw_person)
    phones = extract_signature_phones(sent_email_body)

Imports are lazy (PEP 562): the signature helpers are pure standard library and
stay importable even when Pydantic is not installed; the Pydantic-backed schema
and mappers are only loaded when their names are first accessed.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

# Map public name -> submodule it lives in. Resolved on first access.
_LAZY = {
    # schema
    "EnterpriseContact": "schema",
    "EmailAddress": "schema",
    "PhoneNumber": "schema",
    "PostalAddress": "schema",
    "Organization": "schema",
    "ContactLabel": "schema",
    "SourceSystem": "schema",
    # mappers
    "map_contact": "mappers",
    "BaseContactMapper": "mappers",
    "GooglePeopleMapper": "mappers",
    "MicrosoftGraphMapper": "mappers",
    "ContactMappingError": "mappers",
    # signature (pure stdlib)
    "find_signature_block": "signature",
    "extract_phone_numbers": "signature",
    "extract_signature_phones": "signature",
    "phone_matches_to_schema": "signature",
    "PhoneMatch": "signature",
}

__all__ = list(_LAZY)


def __getattr__(name: str):  # PEP 562 module-level lazy attribute access
    module_name = _LAZY.get(name)
    if module_name is None:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    import importlib

    module = importlib.import_module(f".{module_name}", __name__)
    value = getattr(module, name)
    globals()[name] = value  # cache for next time
    return value


def __dir__():
    return sorted(__all__)


if TYPE_CHECKING:  # help type checkers/IDEs without importing at runtime
    from .mappers import (
        BaseContactMapper,
        ContactMappingError,
        GooglePeopleMapper,
        MicrosoftGraphMapper,
        map_contact,
    )
    from .schema import (
        ContactLabel,
        EmailAddress,
        EnterpriseContact,
        Organization,
        PhoneNumber,
        PostalAddress,
        SourceSystem,
    )
    from .signature import (
        PhoneMatch,
        extract_phone_numbers,
        extract_signature_phones,
        find_signature_block,
        phone_matches_to_schema,
    )
