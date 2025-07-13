from typing import Optional
from sqlmodel import SQLModel
from datetime import datetime
from pydantic import EmailStr


class AgentBase(SQLModel):
    name: str
    type: str = "Chatbot"
    status: Optional[str] = "active"
    role: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None
    threshold: Optional[int] = None
    alert_email: Optional[EmailStr] = None
    system_prompt: Optional[str] = None


class AgentCreate(AgentBase):
    pass


class AgentUpdate(SQLModel):
    name: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None
    threshold: Optional[int] = None
    alert_email: Optional[EmailStr] = None
    system_prompt: Optional[str] = None


class AgentRead(AgentBase):
    id: int
    created_at: datetime
    updated_at: datetime 
