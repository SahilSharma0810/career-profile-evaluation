from __future__ import annotations

from typing import Optional

import sentry_sdk
from opentelemetry import trace

from .request_context import get_request_id
from .settings import settings

_sentry_enabled = False


def init_sentry() -> None:
    global _sentry_enabled

    if _sentry_enabled:
        return
    if not settings.sentry_dsn:
        return

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        release=settings.app_version,
        send_default_pii=False,
        # Tracing is handled by SigNoz via OpenTelemetry; Sentry is used for error reporting.
        traces_sample_rate=0.0,
    )
    _sentry_enabled = True


def _get_trace_id() -> Optional[str]:
    try:
        span_context = trace.get_current_span().get_span_context()
        if span_context and getattr(span_context, "is_valid", False):
            return f"{span_context.trace_id:032x}"
    except Exception:
        pass
    return None


def capture_exception(exc: BaseException) -> None:
    if not _sentry_enabled or not settings.sentry_dsn:
        return

    trace_id = _get_trace_id()
    request_id = get_request_id()

    # Use a local scope so tags attached here don't leak into unrelated events.
    with sentry_sdk.push_scope() as scope:
        if trace_id:
            scope.set_tag("trace_id", trace_id)
        if request_id:
            scope.set_tag("request_id", request_id)
        sentry_sdk.capture_exception(exc)

