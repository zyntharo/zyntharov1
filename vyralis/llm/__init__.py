"""LLM layer: wire types, provider client, quota ledger and router."""

from .client import ModelUnavailable, ProviderClient
from .quota import ProviderHealth, QuotaDecision, QuotaLedger, UsageWindow
from .router import TIER_ORDER, ModelRouter, Requirements, Route, tiers_up_to
from .types import (
    AuthError,
    ChatMessage,
    LLMError,
    LLMResponse,
    ProviderDown,
    QuotaExhausted,
    RateLimited,
    ToolCall,
    ToolSpec,
    Usage,
)

__all__ = [
    "AuthError",
    "ChatMessage",
    "LLMError",
    "LLMResponse",
    "ModelRouter",
    "ModelUnavailable",
    "ProviderClient",
    "ProviderDown",
    "ProviderHealth",
    "QuotaDecision",
    "QuotaExhausted",
    "QuotaLedger",
    "RateLimited",
    "Requirements",
    "Route",
    "TIER_ORDER",
    "ToolCall",
    "ToolSpec",
    "Usage",
    "UsageWindow",
    "tiers_up_to",
]
