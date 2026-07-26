"""Unified enterprise contact schema.

Every external contact source (Google People API, Microsoft Graph API, and any
future provider) is normalised into the :class:`EnterpriseContact` model defined
here. Downstream systems — our leads database, Brevo sync, analytics — only ever
see this shape, never the raw provider payloads.

The models are intentionally permissive on input (contacts from the wild are
messy and partial) but strict on output: an ``EnterpriseContact`` that validates
is safe to persist and forward.
"""

from __future__ import annotations

import re
from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


class SourceSystem(str, Enum):
    """Provider a contact was ingested from."""

    GOOGLE_PEOPLE = "google_people"
    MICROSOFT_GRAPH = "microsoft_graph"
    UNKNOWN = "unknown"


class ContactLabel(str, Enum):
    """Normalised label for emails, phones and addresses.

    Providers use different vocabularies ("work" vs "business", "mobile" vs
    "cell"); we collapse them onto this small, stable set.
    """

    WORK = "work"
    HOME = "home"
    MOBILE = "mobile"
    OTHER = "other"


# Deliberately liberal: full RFC 5322 validation rejects addresses that real
# CRMs happily store. We only guard against obviously broken values.
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_PHONE_ALLOWED = re.compile(r"^[+()\-.\s0-9]+$")


class EmailAddress(BaseModel):
    model_config = ConfigDict(extra="forbid")

    address: str
    label: ContactLabel = ContactLabel.OTHER
    primary: bool = False

    @field_validator("address")
    @classmethod
    def _normalise_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if not _EMAIL_RE.match(cleaned):
            raise ValueError(f"not a valid email address: {value!r}")
        return cleaned


class PhoneNumber(BaseModel):
    model_config = ConfigDict(extra="forbid")

    number: str
    label: ContactLabel = ContactLabel.OTHER
    primary: bool = False

    @field_validator("number")
    @classmethod
    def _normalise_phone(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("phone number is empty")
        if not _PHONE_ALLOWED.match(cleaned):
            raise ValueError(f"phone number has unexpected characters: {value!r}")
        # Collapse runs of whitespace but keep the caller-supplied formatting
        # otherwise (we do not assume a region here).
        return re.sub(r"\s+", " ", cleaned)


class PostalAddress(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: ContactLabel = ContactLabel.OTHER
    street: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    formatted: Optional[str] = None

    @model_validator(mode="after")
    def _require_some_content(self) -> "PostalAddress":
        if not any(
            [self.street, self.city, self.region, self.postal_code, self.country, self.formatted]
        ):
            raise ValueError("postal address has no usable fields")
        return self


class Organization(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None

    @model_validator(mode="after")
    def _require_some_content(self) -> "Organization":
        if not any([self.name, self.title, self.department]):
            raise ValueError("organization has no usable fields")
        return self


class EnterpriseContact(BaseModel):
    """The single, canonical contact shape used across the CRM.

    Construct instances through the mappers in :mod:`tools.crm.mappers` rather
    than by hand — they own the provider-specific translation logic.
    """

    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    # Provenance -----------------------------------------------------------
    source_system: SourceSystem
    source_id: str = Field(..., description="Stable id of the record in the source system.")

    # Identity -------------------------------------------------------------
    display_name: str
    given_name: Optional[str] = None
    family_name: Optional[str] = None

    # Contact channels -----------------------------------------------------
    emails: list[EmailAddress] = Field(default_factory=list)
    phones: list[PhoneNumber] = Field(default_factory=list)
    addresses: list[PostalAddress] = Field(default_factory=list)

    # Professional context -------------------------------------------------
    organizations: list[Organization] = Field(default_factory=list)

    # Extras ---------------------------------------------------------------
    photo_url: Optional[str] = None
    birthday: Optional[date] = None
    notes: Optional[str] = None

    # Bookkeeping ----------------------------------------------------------
    source_updated_at: Optional[datetime] = None

    @field_validator("display_name")
    @classmethod
    def _display_name_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("display_name must not be blank")
        return cleaned

    @field_validator("emails", "phones")
    @classmethod
    def _dedupe_and_single_primary(cls, items: list) -> list:
        """Drop exact duplicates and guarantee at most one primary channel.

        If the source marked several entries primary (or none), we keep the
        first primary — or promote the first entry — so downstream code can rely
        on ``next(e for e in emails if e.primary)`` finding exactly one.
        """
        seen: set = set()
        deduped = []
        for item in items:
            key = item.address if isinstance(item, EmailAddress) else item.number
            if key in seen:
                continue
            seen.add(key)
            deduped.append(item)

        if deduped and not any(i.primary for i in deduped):
            deduped[0].primary = True
        else:
            primary_seen = False
            for item in deduped:
                if item.primary and not primary_seen:
                    primary_seen = True
                elif item.primary:
                    item.primary = False
        return deduped

    @property
    def primary_email(self) -> Optional[str]:
        return next((e.address for e in self.emails if e.primary), None)

    @property
    def primary_phone(self) -> Optional[str]:
        return next((p.number for p in self.phones if p.primary), None)
