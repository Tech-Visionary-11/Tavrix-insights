from pydantic import BaseModel, Field, model_validator, field_validator
from typing import Optional, Dict
from datetime import datetime
from app.models.enum import LogTypeEnum
class LogCreate(BaseModel):
    log_type: LogTypeEnum
    step_code: Optional[str] = Field(
        None, description="Step identifier for which this log was generated"
    )
    content: Optional[str] = Field(
        None, description="The prompt, error message, completion result, etc."
    )
    tokens_used: Optional[int] = Field(
        None, description="Number of tokens used in this log event, if applicable"
    )
    cost: Optional[float] = Field(
        None, description="Cost slice for this log entry"
    )
    meta_data: Optional[dict] = Field(
        None, description="Additional info: model response, stack trace, decision explanation, etc."
    )
    @model_validator(mode="after")
    def validate_required_content(self):
        if self.log_type in {"prompt", "completion", "error"} and not self.content:
            raise ValueError(f"Log content required for {self.log_type} logs")
        return self
    @field_validator("tokens_used")
    @classmethod
    def validate_tokens(cls, v):
        if v is not None and v < 0:
            raise ValueError("tokens_used cannot be negative")
        return v

class LogOut(LogCreate):
    id: str
    session_id: str
    timestamp: datetime
    step_code: Optional[str]
    log_type: str
    content: Optional[str]
    tokens_used: Optional[int]
    cost: Optional[float]
    meta_data: Optional[Dict]

    class Config:
        orm_mode = True
        use_enum_values = True
