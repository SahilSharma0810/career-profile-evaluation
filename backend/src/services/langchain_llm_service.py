from typing import Any, Dict, List, Optional, Sequence

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

from src.config.settings import settings


def _to_langchain_messages(messages: Sequence[Dict[str, str]]) -> List[Any]:
    converted: List[Any] = []
    for message in messages:
        role = message.get("role")
        content = message.get("content", "")

        if role == "system":
            converted.append(SystemMessage(content=content))
        elif role == "assistant":
            converted.append(AIMessage(content=content))
        else:
            converted.append(HumanMessage(content=content))

    return converted


def _extract_text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
                continue
            if isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "\n".join(parts)
    return str(content)


def _openai_chat_model(model: str, api_key: Optional[str]) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        api_key=api_key or settings.openai_api_key,
        timeout=settings.openai_timeout,
        temperature=0,
    )


def _gemini_chat_model() -> Optional[ChatGoogleGenerativeAI]:
    if not settings.gemini_api_key:
        return None
    return ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.gemini_api_key,
        temperature=0,
    )


async def invoke_with_fallback_async(
    *,
    messages: Sequence[Dict[str, str]],
    openai_model: str,
    api_key: Optional[str],
    response_format: Optional[Dict[str, Any]] = None,
) -> Dict[str, str]:
    langchain_messages = _to_langchain_messages(messages)
    openai_model_client = _openai_chat_model(openai_model, api_key)

    if response_format:
        openai_model_client = openai_model_client.bind(response_format=response_format)

    try:
        response = await openai_model_client.ainvoke(langchain_messages)
        return {
            "provider": "openai",
            "content": _extract_text(response.content),
        }
    except Exception as openai_error:
        gemini_model_client = _gemini_chat_model()
        if gemini_model_client is None:
            raise openai_error

        response = await gemini_model_client.ainvoke(langchain_messages)
        return {
            "provider": "gemini",
            "content": _extract_text(response.content),
        }


def invoke_with_fallback_sync(
    *,
    messages: Sequence[Dict[str, str]],
    openai_model: str,
    api_key: Optional[str],
    response_format: Optional[Dict[str, Any]] = None,
) -> Dict[str, str]:
    langchain_messages = _to_langchain_messages(messages)
    openai_model_client = _openai_chat_model(openai_model, api_key)

    if response_format:
        openai_model_client = openai_model_client.bind(response_format=response_format)

    try:
        response = openai_model_client.invoke(langchain_messages)
        return {
            "provider": "openai",
            "content": _extract_text(response.content),
        }
    except Exception as openai_error:
        gemini_model_client = _gemini_chat_model()
        if gemini_model_client is None:
            raise openai_error

        response = gemini_model_client.invoke(langchain_messages)
        return {
            "provider": "gemini",
            "content": _extract_text(response.content),
        }
