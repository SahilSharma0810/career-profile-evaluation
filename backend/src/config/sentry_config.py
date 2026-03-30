from __future__ import annotations

import sentry_sdk

from .request_context import get_request_id
from .settings import settings

_sentry_enabled = False


def init_sentry() -> None:
    global _sentry_enabled

    if _sentry_enabled or not settings.sentry_dsn:
        return

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        release=settings.app_version,
        send_default_pii=False,
        traces_sample_rate=0.0,
    )
    _sentry_enabled = True


def capture_exception(exc: BaseException) -> None:
    if not _sentry_enabled:
        return

    request_id = get_request_id()
    with sentry_sdk.push_scope() as scope:
        if request_id:
            scope.set_tag("request_id", request_id)
        sentry_sdk.capture_exception(exc)
