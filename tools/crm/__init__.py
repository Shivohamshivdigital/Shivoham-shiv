"""CRM contact-normalisation utility — package entry point.

Two import tiers:

* **Eager (pure standard library).** The signature helpers — most importantly
  :func:`extract_signature_phones` — are imported directly at package load, so
  they are available with zero lazy-loading overhead and can run in isolated
  runtimes that have no third-party wheels.
* **Lazy (Pydantic-backed).** :mod:`schema`, :mod:`mappers` and ``map_contact``
  import ``pydantic``, which is unavailable in some environments. They are
  deferred via :pep:`562` ``__getattr__`` so that merely importing this package
  — or touching the signature helpers — never evaluates ``pydantic``.

    from tools.crm import extract_signature_phones   # eager, no pydantic
    from tools.crm import map_contact                # triggers pydantic on access
"""

from __future__ import annotations

from typing import TYPE_CHECKING

# --- Eager tier: pure standard library, safe to import unconditionally ------
# signature.py has no module-level third-party imports (the only pydantic use is
# inside phone_matches_to_schema, deferred to call time), so this stays clean.
from .signature import (
    PhoneMatch,
    extract_phone_numbers,
    extract_signature_phones,
    find_signature_block,
    phone_matches_to_schema,
)

_EAGER = [
    "PhoneMatch",
    "extract_phone_numbers",
    "extract_signature_phones",
    "find_signature_block",
    "phone_matches_to_schema",
]

# --- Lazy tier: name -> submodule, resolved on first access -----------------
_LAZY = {
    # schema
    "EnterpriseContact": "schema",
    "EmailAddress": "schema",
    "PhoneNumber": "schema",
    "PostalAddress": "schema",
    "Organization": "schema",
    "ContactLabel": "schema",
    # mappers
    "map_contact": "mappers",
    "BaseContactMapper": "mappers",
    "GooglePeopleMapper": "mappers",
    "MicrosoftGraphMapper": "mappers",
    "ContactMappingError": "mappers",
}

__all__ = _EAGER + list(_LAZY)


def __getattr__(name: str):
    """PEP 562 hook: import a lazy submodule only when its name is accessed."""
    module_name = _LAZY.get(name)
    if module_name is None:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    import importlib

    module = importlib.import_module(f".{module_name}", __name__)
    value = getattr(module, name)
    globals()[name] = value  # cache so __getattr__ is not called again for it
    return value


def __dir__():
    return sorted(__all__)


if TYPE_CHECKING:  # help type checkers / IDEs without importing at runtime
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
    )
