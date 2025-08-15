from typing import Optional
from pydantic import BaseModel, EmailStr, HttpUrl, field_validator
from app.models.enum import AlertChannelEnum

class AlertConfigCreate(BaseModel):
    enabled: bool = False
    channel: Optional[AlertChannelEnum] = None
    alert_email: Optional[EmailStr] = None
    webhook_url: Optional[HttpUrl] = None
    failure_threshold: Optional[int] = None
    cost_threshold: Optional[float] = None
    notes: Optional[str] = None

    @field_validator("webhook_url", mode="before")  # use mode="before" in v2 for "pre"
    @classmethod
    def blank_to_none(cls, v):
        if v == "":
            return None
        return v
