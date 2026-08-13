"""Run the CRM test suites with Python's built-in ``unittest``.

- `test_signature.py` runs on pure standard library (no shims needed).
- `test_mappers.py` needs Pydantic (and pytest). When the real packages are
  unavailable, this runner installs minimal shims so the tests still EXECUTE —
  clearly labelling that the mapper suite ran against a shim, not real Pydantic.

Usage:
    PYTHONPATH=. python tools/crm/run_tests.py
    PYTHONPATH=. python tools/crm/run_tests.py --module test_signature
"""

from __future__ import annotations

import argparse
import importlib
import sys
import types
import unittest


def _install_shims() -> dict:
    status = {}

    try:
        import pydantic  # noqa: F401
        status["pydantic"] = "real " + getattr(pydantic, "__version__", "?")
    except ModuleNotFoundError:
        from tools.crm import _pydantic_shim
        sys.modules["pydantic"] = _pydantic_shim.build_module()
        status["pydantic"] = "SHIM (real pydantic not installed)"

    try:
        import pytest  # noqa: F401
        status["pytest"] = "real"
    except ModuleNotFoundError:
        sys.modules["pytest"] = _build_pytest_shim()
        status["pytest"] = "SHIM (raises only)"

    return status


def _build_pytest_shim() -> types.ModuleType:
    class _Raises:
        def __init__(self, exc):
            self.exc = exc
            self.value = None

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            if exc_type is None:
                raise AssertionError(f"DID NOT RAISE {self.exc!r}")
            if not issubclass(exc_type, self.exc):
                return False  # let the real (wrong) exception propagate
            self.value = exc_val
            return True

    mod = types.ModuleType("pytest")
    mod.raises = lambda exc: _Raises(exc)
    return mod


def _case_for(modname: str, name: str, fn) -> unittest.TestCase:
    method_name = f"{modname.split('.')[-1]}::{name}"

    class _Case(unittest.TestCase):
        pass

    def runner(self):
        fn()

    runner.__name__ = method_name
    setattr(_Case, method_name, runner)
    return _Case(method_name)


def _collect(modname: str) -> list[unittest.TestCase]:
    mod = importlib.import_module(modname)
    cases = []
    for name in sorted(vars(mod)):
        obj = getattr(mod, name)
        if name.startswith("test_") and callable(obj) and not isinstance(obj, type):
            cases.append(_case_for(modname, name, obj))
    return cases


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--module", action="append",
                        help="test module short name (test_signature/test_mappers). Repeatable.")
    args = parser.parse_args()

    status = _install_shims()
    print("=== dependency status ===")
    for k, v in status.items():
        print(f"  {k}: {v}")
    print()

    names = args.module or ["test_signature", "test_mappers"]
    suite = unittest.TestSuite()
    for short in names:
        suite.addTests(_collect(f"tools.crm.{short}"))

    result = unittest.TextTestRunner(verbosity=2).run(suite)

    if "SHIM" in status.get("pydantic", ""):
        print("\nNOTE: the mapper/schema suite ran against a Pydantic SHIM, not the")
        print("real library. This exercises mapper logic & control flow. For a true")
        print("validation guarantee, run with real Pydantic:")
        print("  pip install -r tools/crm/requirements.txt && python tools/crm/run_tests.py")

    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
