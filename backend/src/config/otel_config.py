from __future__ import annotations

import os
import time
from typing import Optional

from fastapi import FastAPI, Request
from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.metrics import set_meter_provider
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .settings import settings

_otel_initialized: bool = False


def init_otel(app: FastAPI) -> None:
    """
    Initialize OpenTelemetry for SigNoz using OTLP HTTP.

    No-op if `OTEL_EXPORTER_OTLP_ENDPOINT` is not set.
    """

    global _otel_initialized
    if _otel_initialized:
        return

    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "").strip()
    if not otlp_endpoint:
        # Allow running without SigNoz/OTel enabled.
        return

    service_name = os.getenv("OTEL_SERVICE_NAME", "").strip() or settings.app_name

    # SigNoz expects OTLP over HTTP (typically port 4318).
    # We keep configuration driven by OTEL_EXPORTER_OTLP_ENDPOINT and protocol env vars.
    resource = Resource(
        {
            "service.name": service_name,
            "service.version": settings.app_version,
            "deployment.environment": settings.environment,
        }
    )

    tracer_provider = TracerProvider(resource=resource)
    span_exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
    tracer_provider.add_span_processor(BatchSpanProcessor(span_exporter))
    trace.set_tracer_provider(tracer_provider)

    metric_exporter = OTLPMetricExporter(endpoint=otlp_endpoint)
    metric_reader = PeriodicExportingMetricReader(metric_exporter)
    meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
    set_meter_provider(meter_provider)

    # Create spans per request.
    FastAPIInstrumentor.instrument_app(app)

    # Add lightweight request duration + 5xx error metrics.
    meter = metrics.get_meter(service_name)
    http_request_duration_ms = meter.create_histogram("http.server.request_duration_ms")
    http_server_errors_total = meter.create_counter("http.server.errors_total")

    @app.middleware("http")
    async def otel_http_metrics_middleware(request: Request, call_next):
        start = time.monotonic()
        try:
            response = await call_next(request)
        except Exception:
            # If the request fails hard (middleware/exception handler), record as a server error.
            duration_ms = (time.monotonic() - start) * 1000.0
            attrs = {
                "http.method": request.method,
                "http.route": request.url.path,
            }
            http_request_duration_ms.record(duration_ms, attrs)
            http_server_errors_total.add(1, attrs)
            raise

        duration_ms = (time.monotonic() - start) * 1000.0
        attrs = {
            "http.method": request.method,
            "http.route": request.url.path,
            "http.status_code": response.status_code,
        }
        http_request_duration_ms.record(duration_ms, attrs)
        if response.status_code >= 500:
            http_server_errors_total.add(1, attrs)

        return response

    _otel_initialized = True

