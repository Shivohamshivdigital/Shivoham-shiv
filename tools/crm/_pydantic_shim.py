"""A minimal, dependency-free stand-in for the subset of Pydantic v2 that
`tools/crm/schema.py` uses.

Purpose: let the schema/mapper tests EXECUTE with Python's built-in `unittest`
in environments where `pydantic` cannot be installed (e.g. a blocked package
registry). It is installed as the `pydantic` module ONLY when the real package
is absent — see `run_tests.py`.

Scope & honesty: this shim faithfully reproduces the behaviours the tests
depend on — required/optional fields, `field_validator` (including `"*"`),
`model_validator(mode="after")`, `ValidationError`, `str_strip_whitespace`,
default_factory, `model_dump`/`model_dump_json`. It is NOT a general Pydantic
replacement and does not reproduce Pydantic's full type coercion. A green run
against this shim validates the mapper LOGIC and control flow; it is not a
substitute for running the suite against real Pydantic.
"""

from __future__ import annotations

import json
import typing
from datetime import date, datetime
from enum import Enum


class ValidationError(ValueError):
    """Stand-in for pydantic.ValidationError."""


# --- Field / ConfigDict / validators --------------------------------------

_UNSET = object()


class FieldInfo:
    def __init__(self, default=_UNSET, default_factory=None, description=None):
        self.default = default
        self.default_factory = default_factory
        self.description = description


def Field(default=_UNSET, *, default_factory=None, description=None, **_ignored):
    return FieldInfo(default=default, default_factory=default_factory, description=description)


def ConfigDict(**kwargs):
    return dict(kwargs)


class _FieldValidator:
    def __init__(self, fields, mode, func):
        self.fields = fields
        self.mode = mode
        self.func = func  # plain function (cls, value) -> value


class _ModelValidator:
    def __init__(self, mode, func):
        self.mode = mode
        self.func = func  # plain function (self) -> self


def _unwrap(func):
    # Handles being applied over @classmethod (order: @field_validator over @classmethod)
    return func.__func__ if isinstance(func, classmethod) else func


def field_validator(*fields, mode="after"):
    def deco(func):
        return _FieldValidator(fields, mode, _unwrap(func))
    return deco


def model_validator(*, mode="after"):
    def deco(func):
        return _ModelValidator(mode, _unwrap(func))
    return deco


# --- BaseModel ------------------------------------------------------------

def _is_optional(annotation) -> bool:
    # schema.py uses `from __future__ import annotations`, so annotations arrive
    # as strings ("Optional[str]", "List[EmailAddress]", ...). Handle both.
    if isinstance(annotation, str):
        return "Optional[" in annotation or "None" in annotation
    origin = typing.get_origin(annotation)
    if origin is typing.Union:
        return type(None) in typing.get_args(annotation)
    return False


class BaseModel:
    model_config: dict = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        # Collect declared fields (annotations across MRO, subclass-last wins).
        fields = {}
        for klass in reversed(cls.__mro__):
            fields.update(getattr(klass, "__annotations__", {}))
        # Drop non-field class vars (e.g. model_config).
        fields.pop("model_config", None)
        cls.__fields__ = fields

        # Collect validators declared on this class.
        field_validators = []
        model_validators = []
        for name, value in list(vars(cls).items()):
            if isinstance(value, _FieldValidator):
                field_validators.append(value)
                setattr(cls, name, classmethod(value.func))  # keep a callable behind the name
            elif isinstance(value, _ModelValidator):
                model_validators.append(value)
                setattr(cls, name, value.func)
        cls.__field_validators__ = field_validators
        cls.__model_validators__ = model_validators

    def __init__(self, **data):
        cfg = type(self).model_config or {}
        strip = bool(cfg.get("str_strip_whitespace"))
        fields = type(self).__fields__

        for name, annotation in fields.items():
            if name in data:
                value = data[name]
            else:
                default = getattr(type(self), name, _UNSET)
                if isinstance(default, FieldInfo):
                    if default.default_factory is not None:
                        value = default.default_factory()
                    elif default.default is not _UNSET:
                        value = default.default
                    else:
                        value = _UNSET
                elif default is _UNSET or isinstance(default, (_FieldValidator, _ModelValidator)):
                    value = _UNSET
                else:
                    value = default  # a literal default like False / None / ContactLabel.OTHER

            if value is _UNSET:
                raise ValidationError(f"{type(self).__name__}.{name}: field required")

            # str strip — but NOT StrEnum members (they subclass str; stripping
            # would demote them to plain str and lose enum identity).
            if strip and isinstance(value, str) and not isinstance(value, Enum):
                value = value.strip()

            # required (non-optional) fields may not be None
            if value is None and not _is_optional(annotation):
                raise ValidationError(f"{type(self).__name__}.{name}: none is not an allowed value")

            object.__setattr__(self, name, value)

        # Run field validators (mode 'after'): specific first, then wildcards.
        for name in fields:
            for fv in type(self).__field_validators__:
                if name in fv.fields or "*" in fv.fields:
                    try:
                        new_value = fv.func(type(self), getattr(self, name))
                    except ValidationError:
                        raise
                    except (ValueError, TypeError) as exc:
                        raise ValidationError(f"{type(self).__name__}.{name}: {exc}") from exc
                    object.__setattr__(self, name, new_value)

        # Run model validators (mode 'after').
        for mv in type(self).__model_validators__:
            try:
                result = mv.func(self)
            except ValidationError:
                raise
            except (ValueError, TypeError) as exc:
                raise ValidationError(f"{type(self).__name__}: {exc}") from exc
            if result is not None:
                self.__dict__.update(result.__dict__)

    # -- dumping --
    def _dump_value(self, value, mode):
        if isinstance(value, BaseModel):
            return value.model_dump(mode=mode)
        if isinstance(value, list):
            return [self._dump_value(v, mode) for v in value]
        if isinstance(value, Enum):
            return value.value if mode == "json" else value
        if mode == "json" and isinstance(value, (datetime, date)):
            return value.isoformat()
        return value

    def model_dump(self, mode="python"):
        return {name: self._dump_value(getattr(self, name), mode) for name in type(self).__fields__}

    def model_dump_json(self):
        return json.dumps(self.model_dump(mode="json"))

    def __repr__(self):
        inner = ", ".join(f"{n}={getattr(self, n)!r}" for n in type(self).__fields__)
        return f"{type(self).__name__}({inner})"


def build_module():
    """Return a module object exposing this shim as `pydantic`."""
    import types

    mod = types.ModuleType("pydantic")
    mod.BaseModel = BaseModel
    mod.ConfigDict = ConfigDict
    mod.Field = Field
    mod.field_validator = field_validator
    mod.model_validator = model_validator
    mod.ValidationError = ValidationError
    mod.__version__ = "0.0.0-shim"
    return mod
