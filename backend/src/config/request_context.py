from __future__ import annotations

from contextvars import ContextVar
from typing import Optional


# Used for correlation across logs and Sentry events.
request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


def get_request_id() -> Optional[str]:
    return request_id_var.get()
