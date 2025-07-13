from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_id: int = Field(foreign_key="agent.id")
    start: datetime = Field(default_factory=datetime.utcnow)
    end: Optional[datetime] = None
    total_tokens: int = 0
    cost_usd: float = 0.0
    status: str = "running"   # success / failed / running
