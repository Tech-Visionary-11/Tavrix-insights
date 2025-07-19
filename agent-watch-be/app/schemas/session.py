from pydantic import BaseModel, Field
from typing import Optional, Literal, Union
from datetime import datetime


# ---------- Base -----------------------------------------------------------
class SessionBase(BaseModel):
    agent_id: str
    tag: Optional[str] = None
    notes: Optional[str] = None
    input_payload: Optional[Union[str, dict]] = Field(
        None, description="Input used to start the session (raw prompt or structured input)"
    )


# ---------- Create ---------------------------------------------------------
class SessionCreate(SessionBase):
    """Start a new session (status implicitly 'running')."""
    pass


# ---------- Close / Patch --------------------------------------------------
class SessionUpdateClose(BaseModel):
    status: Literal["completed", "error"]
    total_tokens: Optional[int] = Field(
        None, description="Optional fallback if no logs posted"
    )
    cost_usd: Optional[float] = Field(
        None, description="Optional fallback if no logs posted"
    )
    output_payload: Optional[Union[str, dict]] = Field(
        None, description="Result or final output from the session workflow"
    )
    notes: Optional[str] = Field(
        None, description="Concise status or additional explanation on close (e.g., failure reason)"
    )


# ---------- Response / Out -------------------------------------------------
class SessionOut(SessionBase):
    id: str
    status: Literal["running", "completed", "error"]
    total_tokens: int
    cost_usd: float
    error_count: int
    duration_seconds: Optional[float]
    started_at: datetime
    ended_at: Optional[datetime]
    input_payload: Optional[Union[str, dict]] = None
    output_payload: Optional[Union[str, dict]] = None

    class Config:
        orm_mode = True
