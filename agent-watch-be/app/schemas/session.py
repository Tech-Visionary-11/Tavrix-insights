from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# ---------- Base -----------------------------------------------------------
class SessionBase(BaseModel):
    agent_id: str
    tag: Optional[str]  = None
    notes: Optional[str] = None

# ---------- Create ---------------------------------------------------------
class SessionCreate(SessionBase):
    """Start a new session (status implicitly 'running')."""
    pass

# ---------- Close / Patch --------------------------------------------------
class SessionUpdateClose(BaseModel):
    status: Literal["completed", "error"]                  # required
    total_tokens: Optional[int]  = Field(
        None, description="Optional fallback if no logs posted"
    )
    cost_usd:     Optional[float] = Field(
        None, description="Optional fallback if no logs posted"
    )

# ---------- Out ------------------------------------------------------------
class SessionOut(SessionBase):
    id: str
    status: Literal["running", "completed", "error"]
    total_tokens: int
    cost_usd: float
    error_count: int
    duration_seconds: Optional[float]
    started_at: datetime
    ended_at:   Optional[datetime]

    class Config:
        orm_mode = True
