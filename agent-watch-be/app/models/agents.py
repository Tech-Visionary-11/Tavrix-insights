from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum
from pydantic import EmailStr


class AgentType(str, Enum):
    chatbot = "Chatbot"
    workflow = "Workflow"


class AgentStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class Agent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: AgentType = Field(default=AgentType.chatbot)
    status: AgentStatus = Field(default=AgentStatus.active)
    role: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None       # comma‑separated
    avatar_url: Optional[str] = None
    threshold: Optional[int] = None  # e.g. failure threshold
    alert_email: Optional[EmailStr] = None
    system_prompt: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow},
    )
