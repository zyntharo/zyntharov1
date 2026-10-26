"""Agent runtime: roles, the shared agent loop, orchestration and supervision."""

from .agent import Agent, AgentResult
from .manager import ManagerAgent, ManagerEvent
from .orchestrator import Orchestrator, Team
from .roles import (
    EMPLOYEE,
    HEAD,
    MAIN,
    MANAGER,
    ROLES,
    SPECIALIST,
    RoleSpec,
    all_roles,
    role_for,
    suggest_names,
    tier_for_rank,
)

__all__ = [
    "Agent",
    "AgentResult",
    "EMPLOYEE",
    "HEAD",
    "MAIN",
    "MANAGER",
    "ManagerAgent",
    "ManagerEvent",
    "Orchestrator",
    "ROLES",
    "RoleSpec",
    "SPECIALIST",
    "Team",
    "all_roles",
    "role_for",
    "suggest_names",
    "tier_for_rank",
]
