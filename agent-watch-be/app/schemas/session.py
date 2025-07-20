from pydantic import BaseModel, Field, model_validator
from typing import Optional, Literal, Union
from datetime import datetime

# ─── Base -----------------------------------------------------------
class SessionBase(BaseModel):
    agent_id: str
    tag: Optional[str] = None
    notes: Optional[str] = None
    input_payload: Optional[Union[str, dict]] = Field(
        None, description="Input used to start the session"
    )

    model_config = {
        "use_enum_values": True
    }

    @model_validator(mode='after')
    def validate_input_payload(self) -> 'SessionBase':
        if self.input_payload is not None and not isinstance(self.input_payload, (dict, str)):
            raise ValueError("input_payload must be a string or JSON (dict)")
        return self

# ─── Create ---------------------------------------------------------
class SessionCreate(SessionBase):
    pass

# ─── Close / Patch --------------------------------------------------
class SessionUpdateClose(BaseModel):
    status: Literal["completed", "error"]
    total_tokens: Optional[int] = Field(None, description="Fallback if no logs")
    cost_usd: Optional[float] = Field(None, description="Fallback if no logs")
    output_payload: Optional[Union[str, dict]] = Field(None)
    notes: Optional[str] = Field(default=None)

    @model_validator(mode='after')
    def validate_close(self) -> 'SessionUpdateClose':
        if not self.status:
            raise ValueError("status must be provided on session close")
        return self

# ─── Output / Read ------------------------------------------------
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

    model_config = {
        "orm_mode": True,
        "use_enum_values": True
    }
