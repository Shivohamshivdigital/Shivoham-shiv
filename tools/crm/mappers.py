"""Provider-specific mappers into the unified :class:`EnterpriseContact`.

Each mapper takes one raw record from an upstream API and returns a validated
``EnterpriseContact``. Mappers are deliberately defensive (permissive-in): an
individual malformed value — a garbage email, an empty org — is logged and
dropped rather than allowed to sink the whole record. The resulting contact is
still strict-out: it either validates or the record is reported as unmappable.

Usage
-----
>>> from tools.crm.mappers import map_contact
>>> contact = map_contact("google_people", raw_google_person)
>>> contact = map_contact("microsoft_graph", raw_graph_contact)
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import ValidationError

from .schema import (
    ContactLabel,
    EmailAddress,
    EnterpriseContact,
    Organization,
    PhoneNumber,
    PostalAddress,
)

logger = logging.getLogger("crm.mappers")

# Canonical provider identifiers (used as EnterpriseContact.source_system).
GOOGLE_PEOPLE = "google_people"
MICROSOFT_GRAPH = "microsoft_graph"


class ContactMappingError(ValueError):
    """Raised when a record cannot be mapped at all (bad provider, no identity).

    Field-level problems never raise — they are logged and dropped. This is
    reserved for record-level failures so a pipeline can log and skip precisely.
    """

    def __init__(self, message: str, *, provider: str, source_id: Optional[str] = None):
        self.provider = provider
        self.source_id = source_id
        super().__init__(message)


# --- shared helpers --------------------------------------------------------

def _first_non_empty(*values: Any) -> Optional[str]:
    for value in values:
        if value is not None and str(value).strip():
            return str(value).strip()
    return None


def _coerce_label(raw: Any, mapping: dict[str, ContactLabel]) -> ContactLabel:
    if not raw:
        return ContactLabel.OTHER
    return mapping.get(str(raw).strip().lower(), ContactLabel.OTHER)


def _parse_iso8601(value: Any) -> Optional[datetime]:
    """Parse an ISO-8601 timestamp, tolerating a trailing ``Z``. UTC-aware."""
    if not value or not isinstance(value, str):
        return None
    text = value.strip().replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        logger.warning("could not parse timestamp %r", value)
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def _split_display_name(display: Optional[str]) -> tuple[str, str]:
    """Best-effort split of a single display string into (first, last)."""
    if not display or not display.strip():
        return "", ""
    parts = display.strip().split()
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


# --- base contract ---------------------------------------------------------

class BaseContactMapper(ABC):
    """Contract every provider mapper implements.

    Subclasses must declare ``source_system`` and implement the two required
    hooks; the optional ``_extract_*`` hooks default to empty/now so partial
    payloads still map. The base ``map`` assembles and validates the contact,
    converting any Pydantic ``ValidationError`` into a ``ContactMappingError``.
    """

    source_system: str

    def map(self, raw: dict[str, Any]) -> EnterpriseContact:
        if not isinstance(raw, dict):
            raise ContactMappingError(
                f"expected a dict record, got {type(raw).__name__}",
                provider=self.source_system,
            )
        source_id = self._extract_source_id(raw)
        first_name, last_name = self._extract_names(raw)
        try:
            return EnterpriseContact(
                source_system=self.source_system,
                source_id=source_id,
                source_updated_at=self._extract_updated_at(raw) or datetime.now(timezone.utc),
                first_name=first_name,
                last_name=last_name,
                emails=self._extract_emails(raw),
                phones=self._extract_phones(raw),
                addresses=self._extract_addresses(raw),
                organizations=self._extract_organizations(raw),
            )
        except ValidationError as exc:
            raise ContactMappingError(
                f"could not build EnterpriseContact: {exc}",
                provider=self.source_system,
                source_id=source_id,
            ) from exc

    # -- required hooks ----------------------------------------------------
    @abstractmethod
    def _extract_source_id(self, raw: dict[str, Any]) -> str: ...

    @abstractmethod
    def _extract_names(self, raw: dict[str, Any]) -> tuple[str, str]: ...

    # -- optional hooks ----------------------------------------------------
    def _extract_emails(self, raw: dict[str, Any]) -> list[EmailAddress]:
        return []

    def _extract_phones(self, raw: dict[str, Any]) -> list[PhoneNumber]:
        return []

    def _extract_addresses(self, raw: dict[str, Any]) -> list[PostalAddress]:
        return []

    def _extract_organizations(self, raw: dict[str, Any]) -> list[Organization]:
        return []

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        return None

    # -- safe builders (drop invalid values, never raise) ------------------
    def _build_email(self, address: Any, label: ContactLabel, is_primary: bool) -> Optional[EmailAddress]:
        if not address or not str(address).strip():
            return None
        try:
            return EmailAddress(address=str(address), label=label, is_primary=is_primary)
        except ValidationError:
            logger.warning("[%s] dropping invalid email %r", self.source_system, address)
            return None

    def _build_phone(self, number: Any, label: ContactLabel, is_primary: bool) -> Optional[PhoneNumber]:
        if not number or not str(number).strip():
            return None
        try:
            return PhoneNumber(number=str(number), label=label, is_primary=is_primary)
        except ValidationError:
            logger.warning("[%s] dropping invalid phone %r", self.source_system, number)
            return None


# --- Google People ---------------------------------------------------------

class GooglePeopleMapper(BaseContactMapper):
    """Maps a Google People API ``person`` resource.

    Reference: https://developers.google.com/people/api/rest/v1/people#Person
    """

    source_system = GOOGLE_PEOPLE

    _LABELS = {
        "work": ContactLabel.WORK,
        "business": ContactLabel.WORK,
        "office": ContactLabel.WORK,
        "home": ContactLabel.HOME,
        "personal": ContactLabel.HOME,
        "mobile": ContactLabel.MOBILE,
        "cell": ContactLabel.MOBILE,
        "other": ContactLabel.OTHER,
    }

    @staticmethod
    def _is_primary(entry: dict[str, Any]) -> bool:
        return bool(entry.get("metadata", {}).get("primary", False))

    @staticmethod
    def _primary_of(entries: list[dict[str, Any]]) -> dict[str, Any]:
        for entry in entries:
            if entry.get("metadata", {}).get("primary"):
                return entry
        return entries[0] if entries else {}

    def _extract_source_id(self, raw: dict[str, Any]) -> str:
        source_id = _first_non_empty(raw.get("resourceName"))
        if not source_id:
            raise ContactMappingError(
                "google person is missing 'resourceName'", provider=self.source_system
            )
        return source_id

    def _extract_names(self, raw: dict[str, Any]) -> tuple[str, str]:
        name = self._primary_of(raw.get("names", []))
        first = _first_non_empty(name.get("givenName"))
        last = _first_non_empty(name.get("familyName"))
        if first or last:
            return first or "", last or ""
        # Fall back to splitting displayName.
        return _split_display_name(_first_non_empty(name.get("displayName")))

    def _extract_emails(self, raw: dict[str, Any]) -> list[EmailAddress]:
        out = []
        for entry in raw.get("emailAddresses", []):
            email = self._build_email(
                entry.get("value"),
                _coerce_label(entry.get("type"), self._LABELS),
                self._is_primary(entry),
            )
            if email:
                out.append(email)
        return out

    def _extract_phones(self, raw: dict[str, Any]) -> list[PhoneNumber]:
        out = []
        for entry in raw.get("phoneNumbers", []):
            phone = self._build_phone(
                _first_non_empty(entry.get("canonicalForm"), entry.get("value")),
                _coerce_label(entry.get("type"), self._LABELS),
                self._is_primary(entry),
            )
            if phone:
                out.append(phone)
        return out

    def _extract_addresses(self, raw: dict[str, Any]) -> list[PostalAddress]:
        out = []
        for entry in raw.get("addresses", []):
            try:
                out.append(
                    PostalAddress(
                        label=_coerce_label(entry.get("type"), self._LABELS),
                        street=_first_non_empty(entry.get("streetAddress")),
                        city=_first_non_empty(entry.get("city")),
                        region=_first_non_empty(entry.get("region")),
                        postal_code=_first_non_empty(entry.get("postalCode")),
                        country=_first_non_empty(entry.get("country"), entry.get("countryCode")),
                        formatted=_first_non_empty(entry.get("formattedValue")),
                    )
                )
            except ValidationError:
                logger.warning("[%s] dropping empty address", self.source_system)
        return out

    def _extract_organizations(self, raw: dict[str, Any]) -> list[Organization]:
        out = []
        for entry in raw.get("organizations", []):
            try:
                out.append(
                    Organization(
                        name=_first_non_empty(entry.get("name")),
                        title=_first_non_empty(entry.get("title")),
                        department=_first_non_empty(entry.get("department")),
                    )
                )
            except ValidationError:
                logger.warning("[%s] dropping empty organization", self.source_system)
        return out

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        for source in raw.get("metadata", {}).get("sources", []):
            parsed = _parse_iso8601(source.get("updateTime"))
            if parsed:
                return parsed
        return None


# --- Microsoft Graph --------------------------------------------------------

class MicrosoftGraphMapper(BaseContactMapper):
    """Maps a Microsoft Graph ``contact`` resource.

    Reference: https://learn.microsoft.com/en-us/graph/api/resources/contact
    """

    source_system = MICROSOFT_GRAPH

    def _extract_source_id(self, raw: dict[str, Any]) -> str:
        source_id = _first_non_empty(raw.get("id"))
        if not source_id:
            raise ContactMappingError(
                "graph contact is missing 'id'", provider=self.source_system
            )
        return source_id

    def _extract_names(self, raw: dict[str, Any]) -> tuple[str, str]:
        first = _first_non_empty(raw.get("givenName"))
        last = _first_non_empty(raw.get("surname"))  # Graph: surname -> last_name
        if first or last:
            return first or "", last or ""
        return _split_display_name(_first_non_empty(raw.get("displayName")))

    def _extract_emails(self, raw: dict[str, Any]) -> list[EmailAddress]:
        out = []
        # Graph does not label emails; the first is treated as primary.
        for index, entry in enumerate(raw.get("emailAddresses", [])):
            email = self._build_email(entry.get("address"), ContactLabel.OTHER, is_primary=(index == 0))
            if email:
                out.append(email)
        return out

    def _extract_phones(self, raw: dict[str, Any]) -> list[PhoneNumber]:
        # mobilePhone is a scalar; business/home phones are arrays. Surface the
        # mobile first so it becomes the primary channel.
        candidates: list[tuple[Any, ContactLabel]] = [(raw.get("mobilePhone"), ContactLabel.MOBILE)]
        candidates += [(n, ContactLabel.WORK) for n in raw.get("businessPhones", []) or []]
        candidates += [(n, ContactLabel.HOME) for n in raw.get("homePhones", []) or []]

        out = []
        first = True
        for number, label in candidates:
            phone = self._build_phone(number, label, is_primary=first)
            if phone:
                out.append(phone)
                first = False
        return out

    def _extract_addresses(self, raw: dict[str, Any]) -> list[PostalAddress]:
        out = []
        for key, label in (
            ("businessAddress", ContactLabel.WORK),
            ("homeAddress", ContactLabel.HOME),
            ("otherAddress", ContactLabel.OTHER),
        ):
            entry = raw.get(key)
            if not isinstance(entry, dict):
                continue
            try:
                out.append(
                    PostalAddress(
                        label=label,
                        street=_first_non_empty(entry.get("street")),
                        city=_first_non_empty(entry.get("city")),
                        region=_first_non_empty(entry.get("state")),
                        postal_code=_first_non_empty(entry.get("postalCode")),
                        country=_first_non_empty(entry.get("countryOrRegion")),
                    )
                )
            except ValidationError:
                continue  # Graph often returns an all-empty address object.
        return out

    def _extract_organizations(self, raw: dict[str, Any]) -> list[Organization]:
        try:
            return [
                Organization(
                    name=_first_non_empty(raw.get("companyName")),
                    title=_first_non_empty(raw.get("jobTitle")),
                    department=_first_non_empty(raw.get("department")),
                )
            ]
        except ValidationError:
            return []

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        return _parse_iso8601(raw.get("lastModifiedDateTime"))


# --- Dispatcher ------------------------------------------------------------

_MAPPERS: dict[str, BaseContactMapper] = {
    GOOGLE_PEOPLE: GooglePeopleMapper(),
    MICROSOFT_GRAPH: MicrosoftGraphMapper(),
}

# Friendly aliases accepted by the dispatcher.
_ALIASES = {
    "google": GOOGLE_PEOPLE,
    "google_people_api": GOOGLE_PEOPLE,
    "people": GOOGLE_PEOPLE,
    "microsoft": MICROSOFT_GRAPH,
    "msgraph": MICROSOFT_GRAPH,
    "graph": MICROSOFT_GRAPH,
    "outlook": MICROSOFT_GRAPH,
}


def map_contact(provider_name: str, raw_data: dict) -> EnterpriseContact:
    """Map ``raw_data`` from ``provider_name`` into an ``EnterpriseContact``.

    Selects the mapper by provider name (canonical id or a known alias). Invalid
    individual fields are logged and dropped by the mappers; only a bad provider
    or a record with no resolvable identity raises ``ContactMappingError``.
    """
    key = str(provider_name).strip().lower()
    key = _ALIASES.get(key, key)
    mapper = _MAPPERS.get(key)
    if mapper is None:
        raise ContactMappingError(
            f"no mapper registered for provider {provider_name!r}; "
            f"known: {sorted(_MAPPERS)}",
            provider=str(provider_name),
        )
    return mapper.map(raw_data)
