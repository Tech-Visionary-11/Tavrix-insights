# schemas/agent.py
from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field

# ─── Common literals ────────────────────────────────── #
Provider = Literal["openai", "anthropic", "local", "none"]
AgentType = Literal["assistant", "workflow", "tool"]
AgentStatus = Literal["active", "paused", "archived"]

# ─── Base (shared defaults) ─────────────────────────── #
class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[str] = None

    # New optional avatar
    avatar_url: Optional[str] = None

    # Classification
    type: AgentType = "assistant"
    status: AgentStatus = "active"

    # Model config
    provider: Provider
    model_name: Optional[str] = None
    api_key: Optional[str] = None

    # Pricing overrides
    custom_pricing: bool = False
    prompt_price: Optional[float] = None
    completion_price: Optional[float] = None
    track_tokens: bool = True


# ─── Create schema (all required in AgentBase stay required) ─── #
class AgentCreate(AgentBase):
    pass


# ─── Update schema (all fields optional for PATCH / PUT) ─── #
class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tag: Optional[str] = None
    avatar_url: Optional[str] = None

    type: Optional[AgentType] = None
    status: Optional[AgentStatus] = None

    provider: Optional[Provider] = None
    model_name: Optional[str] = None
    api_key: Optional[str] = None

    custom_pricing: Optional[bool] = None
    prompt_price: Optional[float] = None
    completion_price: Optional[float] = None
    track_tokens: Optional[bool] = None


# ─── Response schema ─── #
class AgentOut(AgentBase):
    id: str
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)

    model_config = {"from_attributes": True}  # Pydantic v2 equivalent of orm_mode
