"""OpenAI-compatible chat client.

Deliberately provider-agnostic: anything exposing
``POST {base_url}/chat/completions`` with function calling works - OpenAI,
Anthropic's compatibility endpoint, OpenRouter, Groq, Together, Fireworks,
DeepSeek, vLLM, LM Studio, Ollama, or a customer's in-house gateway. The user
adds them at runtime from Settings -> Providers.

Streaming, tool calls, vision parts and retry classification all live here so
agents only ever see :class:`LLMResponse` or a typed :class:`LLMError`.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncIterator, Callable, Sequence

import httpx

from ..config import ProviderConfig
from .types import (
    AuthError,
    ChatMessage,
    LLMError,
    LLMResponse,
    ProviderDown,
    RateLimited,
    ToolCall,
    ToolSpec,
    Usage,
)

log = logging.getLogger("vyralis.llm.client")

RETRY_STATUS = {408, 409, 425, 500, 502, 503, 504, 522, 524}


class ModelUnavailable(LLMError):
    """The endpoint exists but does not serve the requested model."""

    retryable = False


def _join_url(base: str, path: str) -> str:
    return base.rstrip("/") + "/" + path.lstrip("/")


class ProviderClient:
    """Async chat client for every configured provider."""

    def __init__(self, *, timeout: float = 120.0, max_retries: int = 2) -> None:
        self.timeout = timeout
        self.max_retries = max_retries
        self._clients: dict[str, httpx.AsyncClient] = {}

    async def aclose(self) -> None:
        for client in self._clients.values():
            await client.aclose()
        self._clients.clear()

    def _http(self, provider: ProviderConfig) -> httpx.AsyncClient:
        key = provider.id
        client = self._clients.get(key)
        if client is None or client.is_closed:
            client = httpx.AsyncClient(
                timeout=httpx.Timeout(self.timeout, connect=15.0),
                headers=self._headers(provider),
                # A local gateway may sit on http://127.0.0.1 - allowed.
                follow_redirects=True,
                limits=httpx.Limits(max_connections=16, max_keepalive_connections=8),
            )
            self._clients[key] = client
        return client

    @staticmethod
    def _headers(provider: ProviderConfig) -> dict[str, str]:
        headers = {
            "content-type": "application/json",
            "user-agent": "Vyralis/0.1 (+desktop-agent-runtime)",
        }
        key = provider.resolved_key()
        if key:
            headers["authorization"] = f"Bearer {key}"
        # Anthropic's compatibility layer expects this extra hint.
        if "anthropic" in provider.base_url:
            headers["anthropic-version"] = "2023-06-01"
        return headers

    # -- request assembly ----------------------------------------------
    @staticmethod
    def build_body(
        model: str,
        messages: Sequence[ChatMessage],
        *,
        tools: Sequence[ToolSpec] | None = None,
        temperature: float = 0.35,
        max_tokens: int = 4096,
        stream: bool = False,
        tool_choice: str = "auto",
        extra: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        body: dict[str, Any] = {
            "model": model,
            "messages": [message.to_wire() for message in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream,
        }
        if tools:
            body["tools"] = [tool.to_wire() for tool in tools]
            body["tool_choice"] = tool_choice
            body["parallel_tool_calls"] = False
        if extra:
            body.update(extra)
        return body

    # -- non-streaming --------------------------------------------------
    async def chat(
        self,
        provider: ProviderConfig,
        model: str,
        messages: Sequence[ChatMessage],
        *,
        tools: Sequence[ToolSpec] | None = None,
        temperature: float = 0.35,
        max_tokens: int = 4096,
        extra: dict[str, Any] | None = None,
    ) -> LLMResponse:
        body = self.build_body(
            model, messages, tools=tools, temperature=temperature,
            max_tokens=max_tokens, stream=False, extra=extra,
        )
        payload = await self._post(provider, "/chat/completions", body)
        return self._parse_response(payload, provider, model)

    # -- streaming ------------------------------------------------------
    async def stream_chat(
        self,
        provider: ProviderConfig,
        model: str,
        messages: Sequence[ChatMessage],
        *,
        tools: Sequence[ToolSpec] | None = None,
        temperature: float = 0.35,
        max_tokens: int = 4096,
        on_token: Callable[[str], None] | None = None,
        extra: dict[str, Any] | None = None,
    ) -> LLMResponse:
        """Stream a completion, optionally emitting token deltas to the UI."""
        body = self.build_body(
            model, messages, tools=tools, temperature=temperature,
            max_tokens=max_tokens, stream=True, extra=extra,
        )
        client = self._http(provider)
        url = _join_url(provider.base_url, "/chat/completions")

        content_parts: list[str] = []
        tool_buffers: dict[int, dict[str, Any]] = {}
        usage = Usage()
        finish_reason = ""
        response_id = ""

        try:
            async with client.stream("POST", url, json=body) as response:
                if response.status_code >= 400:
                    detail = (await response.aread()).decode("utf-8", "replace")
                    raise self._classify(response.status_code, detail, provider)
                async for event in self._iter_sse(response):
                    if event.get("id"):
                        response_id = event["id"]
                    choices = event.get("choices") or []
                    if event.get("usage"):
                        usage = self._usage_from(event["usage"])
                    if not choices:
                        continue
                    choice = choices[0]
                    if choice.get("finish_reason"):
                        finish_reason = choice["finish_reason"]
                    delta = choice.get("delta") or {}
                    text = delta.get("content")
                    if text:
                        content_parts.append(text)
                        if on_token:
                            on_token(text)
                    for call_delta in delta.get("tool_calls") or []:
                        index = call_delta.get("index", 0)
                        buffer = tool_buffers.setdefault(
                            index, {"id": "", "name": "", "arguments": ""}
                        )
                        if call_delta.get("id"):
                            buffer["id"] = call_delta["id"]
                        function = call_delta.get("function") or {}
                        if function.get("name"):
                            buffer["name"] += function["name"]
                        if function.get("arguments"):
                            buffer["arguments"] += function["arguments"]
        except httpx.HTTPError as exc:
            raise ProviderDown(f"{provider.id}: transport error: {exc}") from exc

        calls = [self._tool_call_from(buffer) for _, buffer in sorted(tool_buffers.items())]
        calls = [call for call in calls if call.name]
        return LLMResponse(
            content="".join(content_parts),
            tool_calls=calls,
            usage=usage,
            model=model,
            provider_id=provider.id,
            finish_reason=finish_reason or ("tool_calls" if calls else "stop"),
            raw={"id": response_id, "streamed": True},
        )

    @staticmethod
    async def _iter_sse(response: httpx.Response) -> AsyncIterator[dict[str, Any]]:
        async for line in response.aiter_lines():
            if not line:
                continue
            if line.startswith("data:"):
                line = line[5:].strip()
            if not line or line == "[DONE]":
                if line == "[DONE]":
                    return
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue

    # -- transport ------------------------------------------------------
    async def _post(self, provider: ProviderConfig, path: str, body: dict[str, Any]) -> dict[str, Any]:
        client = self._http(provider)
        url = _join_url(provider.base_url, path)
        attempt = 0
        while True:
            attempt += 1
            started = time.perf_counter()
            try:
                response = await client.post(url, json=body)
            except httpx.HTTPError as exc:
                if attempt > self.max_retries:
                    raise ProviderDown(f"{provider.id}: transport error: {exc}") from exc
                await asyncio.sleep(min(8.0, 1.5 * attempt))
                continue
            if response.status_code < 400:
                log.debug("%s %s ok in %.0fms", provider.id, path, (time.perf_counter() - started) * 1000)
                return response.json()
            detail = response.text
            error = self._classify(response.status_code, detail, provider)
            if error.retryable and attempt <= self.max_retries and not isinstance(error, RateLimited):
                await asyncio.sleep(min(8.0, 1.5 * attempt))
                continue
            raise error

    @staticmethod
    def _classify(status: int, detail: str, provider: ProviderConfig) -> LLMError:
        snippet = (detail or "").strip()[:400]
        if status in (401, 403):
            return AuthError(f"{provider.id}: authentication failed ({status}): {snippet}")
        if status == 429:
            retry_after = 20.0
            try:
                data = json.loads(detail)
                retry_after = float(
                    data.get("retry_after")
                    or (data.get("error") or {}).get("retry_after")
                    or retry_after
                )
            except (json.JSONDecodeError, TypeError, ValueError):
                pass
            return RateLimited(f"{provider.id}: rate limited: {snippet}", retry_after)
        if status == 404:
            return ModelUnavailable(f"{provider.id}: model/route not found: {snippet}")
        if status in RETRY_STATUS:
            return ProviderDown(f"{provider.id}: upstream {status}: {snippet}")
        return LLMError(f"{provider.id}: http {status}: {snippet}")

    # -- parsing --------------------------------------------------------
    @classmethod
    def _parse_response(cls, payload: dict[str, Any], provider: ProviderConfig, model: str) -> LLMResponse:
        choices = payload.get("choices") or []
        message = (choices[0].get("message") if choices else {}) or {}
        parsed = ChatMessage.from_wire(message)
        return LLMResponse(
            content=parsed.content,
            tool_calls=parsed.tool_calls,
            usage=cls._usage_from(payload.get("usage") or {}),
            model=payload.get("model") or model,
            provider_id=provider.id,
            finish_reason=(choices[0].get("finish_reason") if choices else "") or "",
            raw=payload,
        )

    @staticmethod
    def _usage_from(raw: dict[str, Any]) -> Usage:
        return Usage(
            tokens_in=int(raw.get("prompt_tokens") or raw.get("input_tokens") or 0),
            tokens_out=int(raw.get("completion_tokens") or raw.get("output_tokens") or 0),
        )

    @staticmethod
    def _tool_call_from(buffer: dict[str, Any]) -> ToolCall:
        args_raw = buffer.get("arguments") or "{}"
        try:
            args = json.loads(args_raw)
        except json.JSONDecodeError:
            args = {"_raw": args_raw}
        if not isinstance(args, dict):
            args = {"value": args}
        return ToolCall(
            id=buffer.get("id") or f"call_{abs(hash(args_raw)) % 10**8}",
            name=buffer.get("name") or "",
            arguments=args,
            raw_arguments=args_raw,
        )

    # -- discovery ------------------------------------------------------
    async def list_models(self, provider: ProviderConfig) -> list[str]:
        """Best-effort ``GET /models``; returns [] when unsupported."""
        try:
            response = await self._http(provider).get(_join_url(provider.base_url, "/models"))
            if response.status_code >= 400:
                return []
            data = response.json()
        except (httpx.HTTPError, json.JSONDecodeError):
            return []
        items = data.get("data") if isinstance(data, dict) else data
        if not isinstance(items, list):
            return []
        out: list[str] = []
        for item in items:
            if isinstance(item, dict):
                name = item.get("id") or item.get("name")
                if name:
                    out.append(str(name))
            elif isinstance(item, str):
                out.append(item)
        return sorted(set(out))
