from __future__ import annotations

from contextvars import ContextVar
from typing import Optional


# Used for correlation in logs/Sentry without leaking PII.
request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


def set_request_id(request_id: str) -> None:
    request_id_var.set(request_id)


def get_request_id() -> Optional[str]:
    return request_id_var.get()

