"""Extract signature blocks and phone numbers from plain-text emails.

Sales reps log contacts from their own sent mail; the useful details almost
always live in the signature block at the foot of the message. This module
isolates that block and pulls phone numbers out of it, deliberately scoping the
search to the signature so body text (order numbers, dates, "call us in 24
hours") does not produce false positives.

Pure standard library — no third-party dependencies. The results are shaped so
they drop straight into the unified contact schema in :mod:`tools.crm.schema`
(see :func:`phone_matches_to_schema` for the bridge, used only when Pydantic is
installed).

Typical use::

    from tools.crm.signature import extract_signature_phones

    for match in extract_signature_phones(email_body):
        print(match.label, match.raw, match.digits)
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Optional

# --- Signature-block detection --------------------------------------------

# RFC 3676 signature delimiter: a line that is exactly "--" or "-- "
# (a trailing space is legal and common). This is the strongest signal.
_SIG_DELIMITER_RE = re.compile(r"^--[ \t]*$")

# Common valedictions / sign-offs that introduce a signature when no explicit
# delimiter is present. Matched at the start of a line, case-insensitively.
_SIGNOFF_RE = re.compile(
    r"^\s*(?:"
    r"best(?:\s+regards|\s+wishes)?"
    r"|kind(?:est)?\s+regards"
    r"|warm(?:est)?\s+regards"
    r"|regards"
    r"|sincerely"
    r"|cheers"
    r"|thanks(?:\s+(?:again|so\s+much|a\s+lot))?"
    r"|thank\s+you"
    r"|many\s+thanks"
    r"|yours(?:\s+(?:truly|sincerely|faithfully))?"
    r"|respectfully"
    r"|cordially"
    r"|talk\s+soon"
    r"|all\s+the\s+best"
    r")\s*[,.!]*\s*$",
    re.IGNORECASE,
)

# How many trailing non-empty lines to treat as a candidate signature when no
# delimiter or sign-off is found. Signatures are compact; keeping this small
# avoids sweeping body text back into scope.
_FALLBACK_TAIL_LINES = 8


def find_signature_block(text: str) -> str:
    """Return the signature block at the end of ``text``, or ``""`` if none.

    Detection strategy, strongest signal first:

    1. An explicit ``--`` delimiter line (RFC 3676) — everything after the last
       one is the signature.
    2. A common sign-off line ("Best regards", "Thanks", "Sincerely", ...) — the
       signature runs from that line to the end.
    3. Strict trailing-lines fallback: the last few non-empty lines, but only if
       they actually contain a contact signal (a phone- or email-like token).
       Without such a signal we return ``""`` rather than guess, so callers never
       mistake ordinary body text for a signature.

    The returned string preserves the original line breaks of the block. An
    empty string means "no signature found".
    """
    if not text or not text.strip():
        return ""

    lines = text.splitlines()

    # 1) Explicit delimiter — use the LAST one (quoted replies can contain more
    #    than one). The block is everything after it.
    delimiter_idx = None
    for i, line in enumerate(lines):
        if _SIG_DELIMITER_RE.match(line):
            delimiter_idx = i
    if delimiter_idx is not None:
        block = "\n".join(lines[delimiter_idx + 1 :]).strip("\n")
        return block

    # 2) Sign-off line — scan from the bottom so we anchor on the last one.
    for i in range(len(lines) - 1, -1, -1):
        if _SIGNOFF_RE.match(lines[i]):
            return "\n".join(lines[i:]).strip("\n")

    # 3) Fallback: trailing non-empty lines, only if they look like contact info.
    non_empty = [ln for ln in lines if ln.strip()]
    if not non_empty:
        return ""
    tail = non_empty[-_FALLBACK_TAIL_LINES:]
    tail_text = "\n".join(tail)
    if _STRONG_CONTACT_RE.search(tail_text):
        return tail_text
    return ""


# A "does this look like a signature" probe for the fallback path. Deliberately
# strict: a bare run of digits (a date like 2026-08-15, an order id) must NOT
# qualify, or ordinary body text would be mistaken for a signature. We require a
# real contact signal — an @-address, a +-prefixed or parenthesised number, or a
# digit run introduced by a phone label.
_STRONG_CONTACT_RE = re.compile(
    r"[^@\s]+@[^@\s]+\.[^@\s]+"                                   # email
    r"|\+\d[\d\s().\-]{5,}\d"                                     # +country intl number
    r"|\(\d{2,4}\)\s*\d"                                          # (area) code
    r"|(?:tel(?:ephone)?|phone|mobile|cell|fax|ph|mob|direct|office|work|home)"
    r"\b[\s.:\-]*\+?\(?\d",                                       # labelled number
    re.IGNORECASE,
)


# --- Phone-number extraction ----------------------------------------------

# Optional leading label a signature might put in front of a number, e.g.
# "Mobile:", "T.", "Direct -", "Ph". Captured so we can classify the number.
_LABEL_RE = re.compile(
    r"(?P<label>tel(?:ephone)?|phone|mobile|cell|direct|office|work|home|"
    r"fax|ph|mob|m|t|p|o|d|f|c)\b[\s.:\-]*",
    re.IGNORECASE,
)

# A phone-shaped run: an optional "+", then digits interspersed with the usual
# separators, bounded so we do not glue onto surrounding word characters. We
# validate the digit count afterwards rather than trying to be exact here.
_PHONE_CANDIDATE_RE = re.compile(
    r"(?<![\w+])"                     # not mid-token
    r"(\+?\(?\d[\d\s().\-]{5,}\d)"    # +, digits, separators, >= 7 chars total
    r"(?![\w])"
)

# Extension immediately following a number, e.g. "x123", " ext. 4567".
# Anchored at the start of the text that follows the phone candidate.
_EXTENSION_RE = re.compile(
    r"[\s,;]*(?:x|ext\.?|extension)\s*(\d{1,6})",
    re.IGNORECASE,
)

_MIN_DIGITS = 7   # shortest sensible local number
_MAX_DIGITS = 15  # E.164 maximum

# Date-shaped candidates whose digit count happens to fall in the phone range
# (e.g. 2026-09-01 -> 8 digits). Rejected before validation. The groupings here
# (4-1/2-1/2, or 1/2-1/2-2/4) do not collide with real phone formats such as
# 415-555-0142 (3-3-4), so genuine numbers are unaffected.
_DATE_LIKE_RE = re.compile(
    r"^\s*(?:"
    r"\d{4}[-/.]\d{1,2}[-/.]\d{1,2}"     # 2026-09-01, 2026/9/1
    r"|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}"  # 01/09/2026, 9-1-26
    r")\s*$"
)


def _classify_label(raw_label: Optional[str]) -> str:
    """Map a raw signature label onto a small, stable vocabulary."""
    if not raw_label:
        return "other"
    key = raw_label.strip().lower().rstrip(".")
    mapping = {
        "mobile": "mobile", "cell": "mobile", "mob": "mobile", "m": "mobile", "c": "mobile",
        "tel": "work", "telephone": "work", "phone": "work", "ph": "work",
        "office": "work", "work": "work", "direct": "work",
        "t": "work", "p": "work", "o": "work", "d": "work",
        "home": "home",
        "fax": "fax", "f": "fax",
    }
    return mapping.get(key, "other")


@dataclass
class PhoneMatch:
    """One phone number found in a signature block."""

    raw: str                              # number exactly as it appeared
    digits: str                           # digits only (with leading + preserved)
    label: str = "other"                  # mobile / work / home / fax / other
    extension: Optional[str] = None       # extension digits, if any
    span: tuple[int, int] = field(default=(0, 0))  # offsets within the searched text

    def e164_ish(self) -> str:
        """Best-effort E.164-style string (kept simple; no region inference)."""
        return self.digits


def _looks_like_number(digits_only: str) -> bool:
    n = len(digits_only.lstrip("+"))
    return _MIN_DIGITS <= n <= _MAX_DIGITS


def extract_phone_numbers(text: str) -> list[PhoneMatch]:
    """Find phone-like numbers anywhere in ``text``.

    Each candidate is validated by digit count (7–15, per E.164) so that dates,
    zip codes and order ids are rejected. Any preceding label ("Mobile:", "T.")
    is used to classify the number. Duplicates (by normalised digits) are
    removed, preserving first-seen order.
    """
    if not text:
        return []

    results: list[PhoneMatch] = []
    seen: set[str] = set()

    for m in _PHONE_CANDIDATE_RE.finditer(text):
        candidate = m.group(1)
        start, end = m.span(1)
        core = candidate.strip()

        # Reject date-shaped tokens (2026-09-01, 09/01/2026) up front: their
        # digit count can look phone-sized but the grouping gives them away.
        if _DATE_LIKE_RE.match(core):
            continue

        # An extension follows the number ("... ext. 227", "...x227"); the phone
        # candidate stops before it, so look at the text immediately after.
        ext_match = _EXTENSION_RE.match(text[end : end + 20])
        extension = ext_match.group(1) if ext_match else None

        digits_only = re.sub(r"[^\d+]", "", core)
        # A stray '+' not at the front is not a country-code marker.
        if "+" in digits_only[1:]:
            digits_only = digits_only[0] + digits_only[1:].replace("+", "")
        if not _looks_like_number(digits_only):
            continue

        # Reject a lone '+' or numbers that are clearly a run of separators.
        if not core:
            continue

        # Look back a short way for a label like "Mobile:" or "T.".
        window_start = max(0, start - 16)
        preceding = text[window_start:start]
        label_match = None
        for lm in _LABEL_RE.finditer(preceding):
            label_match = lm  # keep the last (closest) label
        label = _classify_label(label_match.group("label") if label_match else None)

        key = digits_only + (f"x{extension}" if extension else "")
        if key in seen:
            continue
        seen.add(key)

        results.append(
            PhoneMatch(
                raw=core,
                digits=digits_only,
                label=label,
                extension=extension,
                span=(start, end),
            )
        )

    return results


def extract_signature_phones(body: str, fallback_to_body: bool = False) -> list[PhoneMatch]:
    """Locate the signature block, then extract phone numbers from it.

    This is the main interface: it scopes extraction to the signature so body
    text (invoice ids, dates, "call within 24 hours") does not leak phone-shaped
    false positives.

    If no signature block is detected the default is to return ``[]`` — for
    logging a rep's own contacts, no number is safer than a wrong one. Pass
    ``fallback_to_body=True`` to best-effort scan the whole message instead, for
    unconventional layouts where you accept the false-positive risk.
    """
    block = find_signature_block(body)
    if block:
        return extract_phone_numbers(block)
    if fallback_to_body:
        return extract_phone_numbers(body)
    return []


def phone_matches_to_schema(matches: list[PhoneMatch]) -> list:
    """Bridge :class:`PhoneMatch` objects to schema ``PhoneNumber`` models.

    Imported lazily so this module stays dependency-free unless the caller
    actually needs the Pydantic representation. Fax numbers are labelled
    ``other`` in the schema (which has no fax label). Returns validated
    ``PhoneNumber`` instances.
    """
    from .schema import ContactLabel, PhoneNumber  # local import: optional dep

    label_map = {
        "mobile": ContactLabel.MOBILE,
        "work": ContactLabel.WORK,
        "home": ContactLabel.HOME,
        "fax": ContactLabel.OTHER,
        "other": ContactLabel.OTHER,
    }
    out = []
    for index, match in enumerate(matches):
        number = match.raw + (f" x{match.extension}" if match.extension else "")
        out.append(
            PhoneNumber(
                number=number,
                label=label_map.get(match.label, ContactLabel.OTHER),
                is_primary=(index == 0),
            )
        )
    return out
