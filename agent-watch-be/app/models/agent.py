from sqlalchemy import (
    Column, String, Enum, DateTime, ForeignKey, Integer, JSON
)
from sqlalchemy.sql import func
from sqlalchemy.orm import  relationship
from enum import Enum as PyEnum
import uuid
from .base import Base

# ─── ENUMS ───────────────────────────────────────────── #

class AgentTypeEnum(PyEnum):
    assistant = "assistant"
    workflow = "workflow"
    tool = "tool"

class AgentStatusEnum(PyEnum):
    active = "active"
    paused = "paused"
    archived = "archived"

class ProviderEnum(PyEnum):
    openai = "openai"
    anthropic = "anthropic"
    local = "local"
    none = "none"

class StepTypeEnum(PyEnum):
    action = "action"
    api_call = "api_call"
    condition = "condition"
    human_review = "human_review"


# ─── AGENT MODEL ─────────────────────────────────────── #

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))

    name = Column(String, nullable=False)
    role = Column(String)
    description = Column(String)
    tags = Column(String)
    avatar_url = Column(String)

    type = Column(Enum(AgentTypeEnum), nullable=False, default=AgentTypeEnum.assistant)
    status = Column(Enum(AgentStatusEnum), nullable=False, default=AgentStatusEnum.active)

    # Agent-wide LLM + pricing config (null if not set)
    modal_config = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    steps = relationship("Step", back_populates="agent", cascade="all, delete-orphan")


# ─── STEP MODEL ──────────────────────────────────────── #

class Step(Base):
    __tablename__ = "steps"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))

    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    code = Column(String, nullable=False, index=True)  # step_code for lookup

    name = Column(String, nullable=False)
    type = Column(Enum(StepTypeEnum), nullable=False)

    description = Column(String)
    success_criteria = Column(String)
    order = Column(Integer, nullable=False)

    # Step-specific LLM + pricing config (null if inherits from agent or not needed)
    modal_config = Column(JSON, nullable=True)

    agent = relationship("Agent", back_populates="steps")
