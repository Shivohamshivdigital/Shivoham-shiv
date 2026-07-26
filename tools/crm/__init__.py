"""CRM contact-normalisation utility.

Maps inconsistent contact records from external providers (Google People API,
Microsoft Graph API) into one unified, Pydantic-validated
:class:`EnterpriseContact` schema.

    from tools.crm import map_contact

    contact = map_contact("google_people", raw_person)
    contact = map_contact("microsoft_graph", raw_graph_contact)
"""

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

__all__ = [
    "map_contact",
    "BaseContactMapper",
    "GooglePeopleMapper",
    "MicrosoftGraphMapper",
    "ContactMappingError",
    "EnterpriseContact",
    "EmailAddress",
    "PhoneNumber",
    "PostalAddress",
    "Organization",
    "ContactLabel",
    "SourceSystem",
]
