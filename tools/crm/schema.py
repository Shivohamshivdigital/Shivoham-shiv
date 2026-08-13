"""Unified enterprise contact schema (Pydantic v2).

The first module of the CRM integration utility. It owns strict data validation
and normalisation, enforcing a **permissive-in, strict-out** contract: input may
be messy and partial (mixed case, stray whitespace, duplicates, ambiguous
primaries), but any model that validates is clean, de-duplicated, and safe to
persist or forward.

Construct instances through the provider mappers rather than by hand — they own
the source-specific translation into this shape.
"""

from __future__ import annotations

import re
from datetime import datetime
from enum import StrEnum
from typing import List, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


class ContactLabel(StrEnum):
    """Normalised label for a contact channel.

    Providers use divergent vocabularies ("business" vs "work", "cell" vs
    "mobile"); mappers collapse them onto this small, stable set.
    """

    WORK = "work"
    HOME = "home"
    MOBILE = "mobile"
    OTHER = "other"


# Deliberately liberal: full RFC 5322 validation rejects addresses real CRMs
# happily store. We only guard against obviously broken values.
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_PHONE_ALLOWED_RE = re.compile(r"^[+()\-.\s0-9]+$")


# --- Channel sub-models ----------------------------------------------------

class EmailAddress(BaseModel):
    """A single email address with a normalised, lower-cased value."""

    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    address: str
    label: ContactLabel = ContactLabel.OTHER
    is_primary: bool = False

    @field_validator("address")
    @classmethod
    def _normalise_address(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if not _EMAIL_RE.match(cleaned):
            raise ValueError(f"not a valid email address: {value!r}")
        return cleaned


class PhoneNumber(BaseModel):
    """A single phone number. Keeps caller formatting, validates characters."""

    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    number: str
    label: ContactLabel = ContactLabel.OTHER
    is_primary: bool = False

    @field_validator("number")
    @classmethod
    def _normalise_number(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("phone number must not be empty")
        if not _PHONE_ALLOWED_RE.match(cleaned):
            raise ValueError(f"phone number has unexpected characters: {value!r}")
        # Collapse internal whitespace runs; do not assume a region/format.
        return re.sub(r"\s+", " ", cleaned)


class PostalAddress(BaseModel):
    """A physical address. At least one component must be present."""

    model_config = ConfigDict(str_strip_whitespace=True)

    label: ContactLabel = ContactLabel.OTHER
    street: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    formatted: Optional[str] = None

    @field_validator("*")
    @classmethod
    def _blank_to_none(cls, value):
        # Permissive-in: treat empty strings as "absent".
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @model_validator(mode="after")
    def _require_some_content(self) -> "PostalAddress":
        if not any(
            [self.street, self.city, self.region, self.postal_code, self.country, self.formatted]
        ):
            raise ValueError("postal address has no usable fields")
        return self


class Organization(BaseModel):
    """An employer / affiliation. At least one component must be present."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None

    @field_validator("*")
    @classmethod
    def _blank_to_none(cls, value):
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @model_validator(mode="after")
    def _require_some_content(self) -> "Organization":
        if not any([self.name, self.title, self.department]):
            raise ValueError("organization has no usable fields")
        return self


# --- Invariant helpers -----------------------------------------------------

def _dedupe_and_resolve_primary(items: list, key_attr: str) -> list:
    """De-duplicate a channel list and guarantee exactly one primary.

    - Duplicates (by the normalised ``key_attr``) are collapsed, first occurrence
      wins; if any duplicate was flagged primary, that flag is preserved on the
      survivor.
    - If items exist but none is primary, the first is promoted.
    - If several are primary, only the first stays primary.

    The result: for any non-empty list, exactly one item has ``is_primary`` True,
    so ``primary_email`` / ``primary_phone`` are always predictable.
    """
    survivors: dict = {}
    order: list = []
    for item in items:
        key = getattr(item, key_attr)
        if key in survivors:
            if item.is_primary:
                survivors[key].is_primary = True
        else:
            survivors[key] = item
            order.append(key)

    deduped = [survivors[key] for key in order]
    if not deduped:
        return deduped

    primary_seen = False
    for item in deduped:
        if item.is_primary and not primary_seen:
            primary_seen = True
        elif item.is_primary:
            item.is_primary = False
    if not primary_seen:
        deduped[0].is_primary = True

    return deduped


# --- Main model ------------------------------------------------------------

class EnterpriseContact(BaseModel):
    """The single canonical contact shape used across the CRM."""

    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    # Metadata / provenance
    source_system: str
    source_id: str
    source_updated_at: datetime

    # Core identity
    first_name: str
    last_name: str

    # Channels & context
    emails: List[EmailAddress] = Field(default_factory=list)
    phones: List[PhoneNumber] = Field(default_factory=list)
    addresses: List[PostalAddress] = Field(default_factory=list)
    organizations: List[Organization] = Field(default_factory=list)

    @field_validator("emails")
    @classmethod
    def _resolve_emails(cls, items: List[EmailAddress]) -> List[EmailAddress]:
        return _dedupe_and_resolve_primary(items, "address")

    @field_validator("phones")
    @classmethod
    def _resolve_phones(cls, items: List[PhoneNumber]) -> List[PhoneNumber]:
        return _dedupe_and_resolve_primary(items, "number")

    @property
    def full_name(self) -> str:
        return " ".join(part for part in (self.first_name, self.last_name) if part).strip()

    @property
    def primary_email(self) -> Optional[str]:
        return next((e.address for e in self.emails if e.is_primary), None)

    @property
    def primary_phone(self) -> Optional[str]:
        return next((p.number for p in self.phones if p.is_primary), None)
