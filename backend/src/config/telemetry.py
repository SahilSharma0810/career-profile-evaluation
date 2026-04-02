"""
OpenTelemetry setup for SigNoz (or any OTLP gRPC collector).

Pattern aligned with sail-mimic lifetime.py: TracerProvider + OTLP gRPC export,
FastAPIInstrumentor, plus psycopg2 (Postgres) and httpx (OpenAI SDK) auto-instrumentation.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
from opentelemetry.sdk.resources import (
    DEPLOYMENT_ENVIRONMENT,
    SERVICE_NAME,
    TELEMETRY_SDK_LANGUAGE,
    Resource,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import set_tracer_provider

from src.config.logging_config import get_logger
from src.config.settings import get_settings

if TYPE_CHECKING:
    from fastapi import FastAPI

logger = get_logger(__name__)

_telemetry_initialized = False


def get_tracer(component: str) -> trace.Tracer:
    """Tracer for manual spans (cache, OpenAI). No-op when OTLP is not configured."""
    return trace.get_tracer(component, "2.0.0")


def setup_telemetry(app: "FastAPI") -> None:
    """
    Enable OTLP export and instrument FastAPI, psycopg2, and httpx.
    Call once at startup after routes are registered (see main.py lifespan).
    """
    global _telemetry_initialized

    settings = get_settings()
    if not settings.opentelemetry_endpoint:
        logger.info("OpenTelemetry: no OPENTELEMETRY_ENDPOINT — traces disabled")
        return

    if _telemetry_initialized:
        logger.warning("OpenTelemetry: setup_telemetry called twice; skipping")
        return

    endpoint = settings.opentelemetry_endpoint.strip()
    logger.info(
        "OpenTelemetry: exporting traces to %s (service=%s)",
        endpoint,
        settings.opentelemetry_service_name,
    )

    tracer_provider = TracerProvider(
        resource=Resource(
            attributes={
                SERVICE_NAME: settings.opentelemetry_service_name,
                TELEMETRY_SDK_LANGUAGE: "python",
                DEPLOYMENT_ENVIRONMENT: settings.environment,
            },
        ),
    )

    tracer_provider.add_span_processor(
        BatchSpanProcessor(
            OTLPSpanExporter(
                endpoint=endpoint,
                insecure=settings.opentelemetry_insecure,
            ),
        ),
    )

    excluded = [
        "/career-profile-tool/api/health",
        "/openapi.json",
        "/docs",
        "/redoc",
    ]
    FastAPIInstrumentor().instrument_app(
        app,
        tracer_provider=tracer_provider,
        excluded_urls=",".join(excluded),
    )

    set_tracer_provider(tracer_provider)
    Psycopg2Instrumentor().instrument()
    HTTPXClientInstrumentor().instrument()

    _telemetry_initialized = True


def shutdown_telemetry(app: "FastAPI | None" = None) -> None:
    """Uninstrument and flush/shutdown the tracer provider."""
    global _telemetry_initialized

    settings = get_settings()
    if not settings.opentelemetry_endpoint or not _telemetry_initialized:
        return

    if app is not None:
        try:
            FastAPIInstrumentor().uninstrument_app(app)
        except Exception as exc:
            logger.debug("FastAPI uninstrument: %s", exc)
        try:
            Psycopg2Instrumentor().uninstrument()
        except Exception as exc:
            logger.debug("psycopg2 uninstrument: %s", exc)
        try:
            HTTPXClientInstrumentor().uninstrument()
        except Exception as exc:
            logger.debug("httpx uninstrument: %s", exc)

    provider = trace.get_tracer_provider()
    shutdown = getattr(provider, "shutdown", None)
    if callable(shutdown):
        shutdown()

    _telemetry_initialized = False
