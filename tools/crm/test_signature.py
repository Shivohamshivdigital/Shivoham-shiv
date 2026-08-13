"""Tests for signature-block detection and phone extraction.

Pure standard library — runnable without installing anything:

    python -m pytest tools/crm/test_signature.py
    # or, with no pytest available:
    python tools/crm/test_signature.py
"""

from tools.crm.signature import (
    PhoneMatch,
    extract_phone_numbers,
    extract_signature_phones,
    find_signature_block,
)

# --- Sample emails ---------------------------------------------------------

EMAIL_WITH_DELIMITER = """\
Hi Priya,

Thanks for the call earlier. As discussed, I'll send the proposal over by
Friday. Our reference for this deal is order 4455667788.

--
Anand Kumar
Senior Account Executive | Shivoham Shiv
Mobile: +91 98765 43210
Office: +91 (22) 4004 5000
anand@shivohamshiv.com
"""

EMAIL_WITH_SIGNOFF = """\
Hello Sam,

Great meeting you at the expo. Let's line up a demo next week.

Best regards,
Meera Nair
Direct: (415) 555-0142 ext. 227
www.example.com
"""

EMAIL_NO_SIGNATURE = """\
Quick note: the webinar is on 2026-08-15 and seats are limited.
Please register using code 20260815 before the 12345 attendees fill it up.
"""

EMAIL_MESSY_TAIL = """\
See you then.

John Doe
T +44 20 7946 0958
"""


# --- Signature-block detection ---------------------------------------------

def test_delimiter_block_excludes_body():
    block = find_signature_block(EMAIL_WITH_DELIMITER)
    assert block
    assert "Anand Kumar" in block
    assert "order 4455667788" not in block  # body stays out


def test_signoff_block_starts_at_valediction():
    block = find_signature_block(EMAIL_WITH_SIGNOFF)
    assert block
    assert block.lower().startswith("best regards")
    assert "Meera Nair" in block
    assert "Great meeting you" not in block


def test_no_signature_returns_empty():
    assert find_signature_block(EMAIL_NO_SIGNATURE) == ""


def test_fallback_tail_with_contact_signal():
    block = find_signature_block(EMAIL_MESSY_TAIL)
    assert block
    assert "John Doe" in block


def test_empty_input():
    assert find_signature_block("") == ""
    assert find_signature_block("   \n  \n") == ""


# --- Phone extraction ------------------------------------------------------

def test_extracts_and_classifies_from_signature():
    matches = extract_signature_phones(EMAIL_WITH_DELIMITER)
    digits = {m.digits for m in matches}
    assert "+919876543210" in digits
    assert "+912240045000" in digits
    labels = {m.digits: m.label for m in matches}
    assert labels["+919876543210"] == "mobile"
    assert labels["+912240045000"] == "work"


def test_body_numbers_are_not_extracted():
    # The 10-digit order id in the body must not surface because extraction is
    # scoped to the signature block.
    matches = extract_signature_phones(EMAIL_WITH_DELIMITER)
    assert all("4455667788" not in m.digits for m in matches)


def test_extension_is_parsed():
    matches = extract_signature_phones(EMAIL_WITH_SIGNOFF)
    assert len(matches) == 1
    m = matches[0]
    assert m.digits == "4155550142"
    assert m.extension == "227"
    assert m.label == "work"  # "Direct:"


def test_no_signature_yields_nothing_by_default():
    # No detectable signature -> no numbers, so a body date (2026-08-15) or code
    # (20260815) can never be logged as a phone. Safer than guessing.
    assert extract_signature_phones(EMAIL_NO_SIGNATURE) == []


def test_body_fallback_is_opt_in():
    # With fallback_to_body the whole message is scanned (caller accepts the
    # false-positive risk); without it, nothing.
    assert extract_signature_phones(EMAIL_NO_SIGNATURE) == []
    fallback = extract_signature_phones(EMAIL_NO_SIGNATURE, fallback_to_body=True)
    assert len(fallback) > 0
    assert all(m.label == "other" for m in fallback)


def test_dedupes_repeated_numbers():
    text = "--\nCall me on +1 212 555 0000 or +1 (212) 555-0000."
    matches = extract_phone_numbers(text)
    assert len(matches) == 1
    assert matches[0].digits == "+12125550000"


def test_rejects_too_short_and_too_long():
    assert extract_phone_numbers("id 12345") == []          # 5 digits
    assert extract_phone_numbers("ref 1234567890123456") == []  # 16 digits


def test_rejects_dates_zips_and_short_ids():
    # ZIP (5 digits) rejected by length; dates rejected by shape even though
    # their digit count is phone-sized.
    assert extract_phone_numbers("San Francisco, CA 94105") == []
    assert extract_phone_numbers("Meeting on 2026-09-01, confirmed") == []
    assert extract_phone_numbers("invoice dated 09/01/2026") == []


def test_date_guard_keeps_real_dashed_phone():
    # A genuine 3-3-4 dashed number must NOT be mistaken for a date.
    matches = extract_phone_numbers("Direct: 415-555-0142")
    assert len(matches) == 1
    assert matches[0].digits == "4155550142"


def test_international_formats():
    for raw, expected in [
        ("T +44 20 7946 0958", "+442079460958"),
        ("Tel: 0208 946 0000", "02089460000"),
        ("Mobile +91-98765-43210", "+919876543210"),
    ]:
        matches = extract_phone_numbers(raw)
        assert len(matches) == 1, raw
        assert matches[0].digits == expected, raw


def test_returns_phonematch_objects():
    matches = extract_signature_phones(EMAIL_MESSY_TAIL)
    assert matches and isinstance(matches[0], PhoneMatch)
    assert matches[0].digits == "+442079460958"


# --- Manual runner (works without pytest) ----------------------------------

if __name__ == "__main__":
    import traceback

    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    passed = 0
    for fn in fns:
        try:
            fn()
            passed += 1
            print(f"  ok   {fn.__name__}")
        except Exception:  # noqa: BLE001 - test harness
            print(f"  FAIL {fn.__name__}")
            traceback.print_exc()
    print(f"\n{passed}/{len(fns)} passed")
    raise SystemExit(0 if passed == len(fns) else 1)
