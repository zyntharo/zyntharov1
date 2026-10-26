"""Wire types shared by the LLM client, router and agents."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any, Literal

Role = Literal["system", "user", "assistant", "tool"]


@dataclass
class ToolCall:
    id: str
    name: str
    arguments: dict[str, Any] = field(default_factory=dict)
    raw_arguments: str = ""

    def to_wire(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "type": "function",
            "function": {"name": self.name, "arguments": self.raw_arguments or json.dumps(self.arguments)},
        }


@dataclass
class ChatMessage:
    role: Role
    content: str = ""
    name: str | None = None
    tool_calls: list[ToolCall] = field(default_factory=list)
    tool_call_id: str | None = None
    # Base64 data URLs for vision calls ("without vision" agents simply omit these).
    images: list[str] = field(default_factory=list)

    def to_wire(self) -> dict[str, Any]:
        if self.role == "tool":
            return {"role": "tool", "tool_call_id": self.tool_call_id, "content": self.content or ""}
        message: dict[str, Any] = {"role": self.role}
        if self.images:
            parts: list[dict[str, Any]] = []
            if self.content:
                parts.append({"type": "text", "text": self.content})
            for url in self.images:
                parts.append({"type": "image_url", "image_url": {"url": url}})
            message["content"] = parts
        else:
            message["content"] = self.content or ""
        if self.name:
            message["name"] = self.name
        if self.tool_calls:
            message["tool_calls"] = [call.to_wire() for call in self.tool_calls]
        return message

    @classmethod
    def from_wire(cls, raw: dict[str, Any]) -> "ChatMessage":
        calls = []
        for item in raw.get("tool_calls") or []:
            function = item.get("function") or {}
            args_raw = function.get("arguments") or "{}"
            try:
                args = json.loads(args_raw) if isinstance(args_raw, str) else dict(args_raw)
            except json.JSONDecodeError:
                args = {}
            calls.append(
                ToolCall(
                    id=item.get("id") or "",
                    name=function.get("name") or "",
                    arguments=args,
                    raw_arguments=args_raw if isinstance(args_raw, str) else json.dumps(args),
                )
            )
        content = raw.get("content")
        if isinstance(content, list):
            content = " ".join(
                part.get("text", "") for part in content if isinstance(part, dict)
            )
        return cls(
            role=raw.get("role", "assistant"),
            content=content or "",
            name=raw.get("name"),
            tool_calls=calls,
            tool_call_id=raw.get("tool_call_id"),
        )


@dataclass
class ToolSpec:
    """A callable capability exposed to a model as an OpenAI function."""

    name: str
    description: str
    parameters: dict[str, Any] = field(default_factory=lambda: {"type": "object", "properties": {}})
    category: str = "general"
    permission: str = "safe"          # safe | sensitive | destructive
    requires_vision: bool = False

    def to_wire(self) -> dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            },
        }


@dataclass
class Usage:
    tokens_in: int = 0
    tokens_out: int = 0

    @property
    def total(self) -> int:
        return self.tokens_in + self.tokens_out


@dataclass
class LLMResponse:
    content: str = ""
    tool_calls: list[ToolCall] = field(default_factory=list)
    usage: Usage = field(default_factory=Usage)
    model: str = ""
    provider_id: str = ""
    finish_reason: str = ""
    raw: dict[str, Any] = field(default_factory=dict)

    @property
    def wants_tools(self) -> bool:
        return bool(self.tool_calls)


class LLMError(RuntimeError):
    """Base class for provider failures."""

    retryable = False
    status: int | None = None


class AuthError(LLMError):
    """Bad or missing API key."""


class RateLimited(LLMError):
    """Provider said slow down (HTTP 429). ``retry_after`` is in seconds."""

    retryable = True

    def __init__(self, message: str, retry_after: float = 0.0, status: int = 429) -> None:
        super().__init__(message)
        self.retry_after = retry_after
        self.status = status


class QuotaExhausted(LLMError):
    """Our own ledger says this provider/model has no budget left right now."""

    def __init__(self, message: str, wait_seconds: float = 0.0) -> None:
        super().__init__(message)
        self.wait_seconds = wait_seconds


class ProviderDown(LLMError):
    """Transport error, 5xx, or repeated failure."""

    retryable = True
