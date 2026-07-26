"""Provider-specific mappers into the unified :class:`EnterpriseContact`.

Each mapper takes one raw record from an upstream API and returns a validated
``EnterpriseContact``. Mappers are deliberately defensive: upstream payloads are
partial, occasionally malformed, and evolve over time, so a single bad field
(e.g. a garbage email) is dropped rather than allowed to sink the whole record.

Usage
-----
>>> from tools.crm.mappers import map_contact
>>> contact = map_contact("google_people", raw_google_person)
>>> contact = map_contact("microsoft_graph", raw_graph_contact)

Or use a concrete mapper directly::

>>> GooglePeopleMapper().map(raw_google_person)
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import date, datetime, timezone
from typing import Any, Optional

from pydantic import ValidationError

from .schema import (
    ContactLabel,
    EmailAddress,
    EnterpriseContact,
    Organization,
    PhoneNumber,
    PostalAddress,
    SourceSystem,
)

logger = logging.getLogger("crm.mappers")


class ContactMappingError(ValueError):
    """Raised when a record cannot be mapped into an EnterpriseContact.

    Carries the original ``source`` and, when available, the ``source_id`` so
    ingestion pipelines can log and skip the offending record precisely.
    """

    def __init__(self, message: str, *, source: str, source_id: Optional[str] = None):
        self.source = source
        self.source_id = source_id
        super().__init__(message)


def _first_non_empty(*values: Optional[str]) -> Optional[str]:
    for value in values:
        if value and str(value).strip():
            return str(value).strip()
    return None


def _coerce_label(raw: Optional[str], mapping: dict[str, ContactLabel]) -> ContactLabel:
    if not raw:
        return ContactLabel.OTHER
    return mapping.get(str(raw).strip().lower(), ContactLabel.OTHER)


class BaseContactMapper(ABC):
    """Common scaffolding for provider mappers.

    Subclasses implement the ``_extract_*`` hooks; the base class assembles the
    pieces and performs the final validation, converting any Pydantic
    ``ValidationError`` into a :class:`ContactMappingError` with provenance.
    """

    source_system: SourceSystem

    def map(self, raw: dict[str, Any]) -> EnterpriseContact:
        if not isinstance(raw, dict):
            raise ContactMappingError(
                f"expected a dict record, got {type(raw).__name__}",
                source=self.source_system.value,
            )

        source_id = self._extract_source_id(raw)
        try:
            return EnterpriseContact(
                source_system=self.source_system,
                source_id=source_id,
                display_name=self._extract_display_name(raw),
                given_name=self._extract_given_name(raw),
                family_name=self._extract_family_name(raw),
                emails=self._extract_emails(raw),
                phones=self._extract_phones(raw),
                addresses=self._extract_addresses(raw),
                organizations=self._extract_organizations(raw),
                photo_url=self._extract_photo_url(raw),
                birthday=self._extract_birthday(raw),
                notes=self._extract_notes(raw),
                source_updated_at=self._extract_updated_at(raw),
            )
        except ValidationError as exc:
            raise ContactMappingError(
                f"could not build EnterpriseContact: {exc}",
                source=self.source_system.value,
                source_id=source_id,
            ) from exc

    # -- required hooks ----------------------------------------------------
    @abstractmethod
    def _extract_source_id(self, raw: dict[str, Any]) -> str: ...

    @abstractmethod
    def _extract_display_name(self, raw: dict[str, Any]) -> str: ...

    # -- optional hooks (sensible no-op defaults) --------------------------
    def _extract_given_name(self, raw: dict[str, Any]) -> Optional[str]:
        return None

    def _extract_family_name(self, raw: dict[str, Any]) -> Optional[str]:
        return None

    def _extract_emails(self, raw: dict[str, Any]) -> list[EmailAddress]:
        return []

    def _extract_phones(self, raw: dict[str, Any]) -> list[PhoneNumber]:
        return []

    def _extract_addresses(self, raw: dict[str, Any]) -> list[PostalAddress]:
        return []

    def _extract_organizations(self, raw: dict[str, Any]) -> list[Organization]:
        return []

    def _extract_photo_url(self, raw: dict[str, Any]) -> Optional[str]:
        return None

    def _extract_birthday(self, raw: dict[str, Any]) -> Optional[date]:
        return None

    def _extract_notes(self, raw: dict[str, Any]) -> Optional[str]:
        return None

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        return None

    # -- shared helpers ----------------------------------------------------
    def _build_email(self, address: Optional[str], label: ContactLabel, primary: bool) -> Optional[EmailAddress]:
        """Build one EmailAddress, or ``None`` if the value is unusable.

        Malformed emails are logged and dropped so a single bad row cannot fail
        an otherwise valid contact.
        """
        if not address or not str(address).strip():
            return None
        try:
            return EmailAddress(address=address, label=label, primary=primary)
        except ValidationError:
            logger.warning("[%s] dropping invalid email %r", self.source_system.value, address)
            return None

    def _build_phone(self, number: Optional[str], label: ContactLabel, primary: bool) -> Optional[PhoneNumber]:
        if not number or not str(number).strip():
            return None
        try:
            return PhoneNumber(number=number, label=label, primary=primary)
        except ValidationError:
            logger.warning("[%s] dropping invalid phone %r", self.source_system.value, number)
            return None


class GooglePeopleMapper(BaseContactMapper):
    """Maps a Google People API ``person`` resource.

    Reference: https://developers.google.com/people/api/rest/v1/people#Person
    """

    source_system = SourceSystem.GOOGLE_PEOPLE

    _LABELS = {
        "work": ContactLabel.WORK,
        "home": ContactLabel.HOME,
        "mobile": ContactLabel.MOBILE,
        "cell": ContactLabel.MOBILE,
    }

    @staticmethod
    def _is_primary(entry: dict[str, Any]) -> bool:
        return bool(entry.get("metadata", {}).get("primary", False))

    @staticmethod
    def _primary_of(entries: list[dict[str, Any]]) -> dict[str, Any]:
        """Return the primary entry, else the first, else ``{}``."""
        for entry in entries:
            if entry.get("metadata", {}).get("primary"):
                return entry
        return entries[0] if entries else {}

    def _extract_source_id(self, raw: dict[str, Any]) -> str:
        source_id = _first_non_empty(raw.get("resourceName"))
        if not source_id:
            raise ContactMappingError(
                "google person is missing 'resourceName'",
                source=self.source_system.value,
            )
        return source_id

    def _extract_display_name(self, raw: dict[str, Any]) -> str:
        name = self._primary_of(raw.get("names", []))
        display = _first_non_empty(
            name.get("displayName"),
            " ".join(filter(None, [name.get("givenName"), name.get("familyName")])) or None,
            # Fall back to the primary email's local part so we never violate the
            # non-blank display_name invariant for a contact that has an email.
            (self._primary_of(raw.get("emailAddresses", [])).get("value") or "").split("@")[0] or None,
        )
        if not display:
            raise ContactMappingError(
                "google person has no name or email to derive a display name",
                source=self.source_system.value,
                source_id=raw.get("resourceName"),
            )
        return display

    def _extract_given_name(self, raw: dict[str, Any]) -> Optional[str]:
        return _first_non_empty(self._primary_of(raw.get("names", [])).get("givenName"))

    def _extract_family_name(self, raw: dict[str, Any]) -> Optional[str]:
        return _first_non_empty(self._primary_of(raw.get("names", [])).get("familyName"))

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
                logger.warning("[%s] dropping empty address", self.source_system.value)
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
                logger.warning("[%s] dropping empty organization", self.source_system.value)
        return out

    def _extract_photo_url(self, raw: dict[str, Any]) -> Optional[str]:
        photos = raw.get("photos", [])
        primary = self._primary_of(photos)
        return _first_non_empty(primary.get("url"))

    def _extract_birthday(self, raw: dict[str, Any]) -> Optional[date]:
        for entry in raw.get("birthdays", []):
            d = entry.get("date") or {}
            year, month, day = d.get("year"), d.get("month"), d.get("day")
            if year and month and day:
                try:
                    return date(int(year), int(month), int(day))
                except ValueError:
                    continue
        return None

    def _extract_notes(self, raw: dict[str, Any]) -> Optional[str]:
        biographies = raw.get("biographies", [])
        primary = self._primary_of(biographies)
        return _first_non_empty(primary.get("value"))

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        for source in raw.get("metadata", {}).get("sources", []):
            update_time = source.get("updateTime")
            if update_time:
                return _parse_iso8601(update_time)
        return None


class MicrosoftGraphMapper(BaseContactMapper):
    """Maps a Microsoft Graph ``contact`` resource.

    Reference: https://learn.microsoft.com/en-us/graph/api/resources/contact
    """

    source_system = SourceSystem.MICROSOFT_GRAPH

    def _extract_source_id(self, raw: dict[str, Any]) -> str:
        source_id = _first_non_empty(raw.get("id"))
        if not source_id:
            raise ContactMappingError(
                "graph contact is missing 'id'",
                source=self.source_system.value,
            )
        return source_id

    def _extract_display_name(self, raw: dict[str, Any]) -> str:
        first_email = (raw.get("emailAddresses") or [{}])[0].get("address", "")
        display = _first_non_empty(
            raw.get("displayName"),
            " ".join(filter(None, [raw.get("givenName"), raw.get("surname")])) or None,
            (first_email.split("@")[0] if first_email else None),
        )
        if not display:
            raise ContactMappingError(
                "graph contact has no name or email to derive a display name",
                source=self.source_system.value,
                source_id=raw.get("id"),
            )
        return display

    def _extract_given_name(self, raw: dict[str, Any]) -> Optional[str]:
        return _first_non_empty(raw.get("givenName"))

    def _extract_family_name(self, raw: dict[str, Any]) -> Optional[str]:
        # Graph uses "surname" for the family name.
        return _first_non_empty(raw.get("surname"))

    def _extract_emails(self, raw: dict[str, Any]) -> list[EmailAddress]:
        out = []
        # Graph does not label emails; the first is treated as primary.
        for index, entry in enumerate(raw.get("emailAddresses", [])):
            email = self._build_email(
                entry.get("address"),
                ContactLabel.OTHER,
                primary=(index == 0),
            )
            if email:
                out.append(email)
        return out

    def _extract_phones(self, raw: dict[str, Any]) -> list[PhoneNumber]:
        out = []
        # mobilePhone is a scalar; business/home phones are lists. We surface the
        # mobile first so it becomes the primary channel.
        candidates: list[tuple[Optional[str], ContactLabel]] = [
            (raw.get("mobilePhone"), ContactLabel.MOBILE),
        ]
        candidates += [(n, ContactLabel.WORK) for n in raw.get("businessPhones", []) or []]
        candidates += [(n, ContactLabel.HOME) for n in raw.get("homePhones", []) or []]

        first = True
        for number, label in candidates:
            phone = self._build_phone(number, label, primary=first)
            if phone:
                out.append(phone)
                first = False
        return out

    def _extract_addresses(self, raw: dict[str, Any]) -> list[PostalAddress]:
        out = []
        graph_addresses = [
            ("businessAddress", ContactLabel.WORK),
            ("homeAddress", ContactLabel.HOME),
            ("otherAddress", ContactLabel.OTHER),
        ]
        for key, label in graph_addresses:
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
                # Graph often returns an all-empty address object; skip it.
                continue
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

    def _extract_notes(self, raw: dict[str, Any]) -> Optional[str]:
        return _first_non_empty(raw.get("personalNotes"))

    def _extract_birthday(self, raw: dict[str, Any]) -> Optional[date]:
        parsed = _parse_iso8601(raw.get("birthday"))
        return parsed.date() if parsed else None

    def _extract_updated_at(self, raw: dict[str, Any]) -> Optional[datetime]:
        return _parse_iso8601(raw.get("lastModifiedDateTime"))


def _parse_iso8601(value: Optional[str]) -> Optional[datetime]:
    """Parse an ISO-8601 timestamp, tolerating a trailing ``Z``.

    Returns a timezone-aware ``datetime`` (assuming UTC when no offset is
    present), or ``None`` if the value is missing or unparseable.
    """
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


# Registry for the convenience dispatcher below. Keyed by both the enum value
# and the enum member so callers can pass either.
_MAPPERS: dict[str, BaseContactMapper] = {
    SourceSystem.GOOGLE_PEOPLE.value: GooglePeopleMapper(),
    SourceSystem.MICROSOFT_GRAPH.value: MicrosoftGraphMapper(),
}


def map_contact(source: "str | SourceSystem", raw: dict[str, Any]) -> EnterpriseContact:
    """Map ``raw`` from ``source`` into an :class:`EnterpriseContact`.

    ``source`` accepts either a :class:`SourceSystem` member or its string value
    (e.g. ``"google_people"``). Raises :class:`ContactMappingError` for an
    unknown source or an unmappable record.
    """
    key = source.value if isinstance(source, SourceSystem) else str(source).strip().lower()
    mapper = _MAPPERS.get(key)
    if mapper is None:
        raise ContactMappingError(
            f"no mapper registered for source {source!r}; "
            f"known sources: {sorted(_MAPPERS)}",
            source=str(source),
        )
    return mapper.map(raw)
