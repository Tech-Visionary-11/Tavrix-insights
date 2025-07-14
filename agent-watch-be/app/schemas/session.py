from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class SessionBase(SQLModel):
    agent_id: int
    tag: Optional[str] = None
    notes: Optional[str] = None
    status: str = "running"
    total_tokens: int = 0
    cost_usd: float = 0.0
    error_count: int = 0


class SessionCreate(SessionBase):
    started_at: Optional[datetime] = None


class SessionUpdate(SQLModel):
    status: Optional[str] = None
    ended_at: Optional[datetime] = None
    total_tokens: Optional[int] = None
    cost_usd: Optional[float] = None
    error_count: Optional[int] = None
    notes: Optional[str] = None
    tag: Optional[str] = None


class SessionRead(SessionBase):
    id: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
