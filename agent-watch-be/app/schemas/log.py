# app/schemas/log.py
from pydantic import BaseModel, Field
from typing import Optional, Literal

class LogCreate(BaseModel):
    log_type:   Literal["prompt", "completion", "error", "info"]
    content:    Optional[str] = None
    tokens_used: Optional[int] = Field(
        None, description="Optional; leave null to auto‑count later"
    )
    cost: Optional[float] = Field(
        None, description="Optional; leave null to auto‑calculate"
    )

class LogOut(LogCreate):
    id:        str
    timestamp: str   # ISO 8601

    class Config:
        orm_mode = True
