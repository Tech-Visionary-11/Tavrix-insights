from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.agent import AgentTypeEnum, AgentStatusEnum, ProviderEnum  # 👈 use enums from model

# ─── Base schema ─── #
class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None

    type: AgentTypeEnum = AgentTypeEnum.assistant
    status: AgentStatusEnum = AgentStatusEnum.active
    provider: ProviderEnum

    model_name: Optional[str] = None
    api_key: Optional[str] = None

    custom_pricing: bool = False
    prompt_price: Optional[float] = None
    completion_price: Optional[float] = None
    track_tokens: bool = True

    model_config = {
        "use_enum_values": True  # ✅ Required to output strings like "assistant"
    }


# ─── Create ─── #
class AgentCreate(AgentBase):
    pass


# ─── Update ─── #
class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None

    type: Optional[AgentTypeEnum] = None
    status: Optional[AgentStatusEnum] = None
    provider: Optional[ProviderEnum] = None

    model_name: Optional[str] = None
    api_key: Optional[str] = None

    custom_pricing: Optional[bool] = None
    prompt_price: Optional[float] = None
    completion_price: Optional[float] = None
    track_tokens: Optional[bool] = None

    model_config = {
        "use_enum_values": True
    }


# ─── Response ─── #
class AgentOut(AgentBase):
    id: str
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)

    model_config = {
        "from_attributes": True,     # ✅ to allow orm -> pydantic conversion
        "use_enum_values": True      # ✅ to avoid validation errors on enum fields
    }
