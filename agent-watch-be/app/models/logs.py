from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Log(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id")
    category: str            # Prompt / Response / Error / Step
    tag: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
