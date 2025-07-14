from sqlalchemy import Column, String, Float, Boolean, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
from typing import Optional
from enum import Enum as PyEnum
from datetime import datetime
import uuid

Base = declarative_base()

# ─── ENUMS ──────────────────────────────────────────────── #

class ProviderEnum(PyEnum):
    openai = "openai"
    anthropic = "anthropic"
    local = "local"
    none = "none"

class AgentTypeEnum(PyEnum):
    assistant = "assistant"
    workflow = "workflow"
    tool = "tool"

class AgentStatusEnum(PyEnum):
    active = "active"
    paused = "paused"
    archived = "archived"

# ─── AGENT MODEL ─────────────────────────────────────────── #

class Agent(Base):
    __tablename__ = "agents"

    id: str = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name: str = Column(String, nullable=False)
    description: Optional[str] = Column(String)
    tags: Optional[str] = Column(String)

    avatar_url: Optional[str] = Column(String)

    type: AgentTypeEnum = Column(Enum(AgentTypeEnum), nullable=False, default=AgentTypeEnum.assistant)
    status: AgentStatusEnum = Column(Enum(AgentStatusEnum), nullable=False, default=AgentStatusEnum.active)

    provider: ProviderEnum = Column(Enum(ProviderEnum), nullable=False)
    model_name: Optional[str] = Column(String)
    api_key: Optional[str] = Column(String)

    custom_pricing: bool = Column(Boolean, default=False)
    prompt_price: Optional[float] = Column(Float)
    completion_price: Optional[float] = Column(Float)
    track_tokens: bool = Column(Boolean, default=True)

    created_at: Optional[datetime] = Column(DateTime(timezone=True), server_default=func.now())
    updated_at: Optional[datetime] = Column(DateTime(timezone=True), onupdate=func.now())
