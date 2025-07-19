from pydantic import BaseModel, Field
from typing import Optional
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

class LogOut(LogCreate):
    id: str
    timestamp: datetime

    class Config:
        orm_mode = True
        use_enum_values = True
