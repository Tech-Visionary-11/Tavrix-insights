from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel, Field, model_validator, field_validator
from app.models.agent import AgentTypeEnum, AgentStatusEnum, StepTypeEnum, ProviderEnum

# ─── StepBase ─── #
class StepBase(BaseModel):
    code: str
    name: str
    type: StepTypeEnum
    description: Optional[str] = None
    success_criteria: Optional[str] = None
    order: int
    modal_config: Optional[Dict] = None

    model_config = {
        "use_enum_values": True
    }

# ─── Create Agent ─── #
class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None
    type: AgentTypeEnum = AgentTypeEnum.assistant
    status: AgentStatusEnum = AgentStatusEnum.active
    modal_config: Optional[dict] = None
    steps: Optional[List[StepBase]] = None

    model_config = {
        "use_enum_values": True
    }

    @model_validator(mode='after')
    def validate_steps(self) -> 'AgentCreate':
        if self.steps:
            codes = [s.code for s in self.steps]
            orders = [s.order for s in self.steps]
            if len(set(codes)) < len(self.steps):
                raise ValueError("Duplicate step codes are not allowed")
            if len(set(orders)) < len(self.steps):
                raise ValueError("Duplicate step order values are not allowed")
        return self

    @field_validator("modal_config")
    @classmethod
    def validate_modal_config(cls, value):
        if value:
            if not isinstance(value, dict):
                raise TypeError("modal_config must be a dictionary")
            if "provider" in value and value["provider"] not in ProviderEnum.__members__:
                raise ValueError(f"Invalid provider: {value['provider']}")
        return value

# ─── StepUpdate ─── #
class StepUpdate(BaseModel):
    id: Optional[str]
    code: str
    name: str
    type: StepTypeEnum
    description: Optional[str] = None
    success_criteria: Optional[str] = None
    order: int
    modal_config: Optional[Dict] = None

    model_config = {
        "use_enum_values": True
    }

# ─── AgentUpdate ─── #
class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None
    type: Optional[AgentTypeEnum] = None
    status: Optional[AgentStatusEnum] = None
    modal_config: Optional[dict] = None
    steps: Optional[List[StepUpdate]] = None

    model_config = {
        "use_enum_values": True
    }

    @model_validator(mode='after')
    def validate_updated_steps(self) -> 'AgentUpdate':
        if self.steps:
            codes = [s.code for s in self.steps]
            if len(set(codes)) < len(self.steps):
                raise ValueError("Step codes must be unique in update payload")
        return self

# ─── Output Schemas ─── #
class StepOut(StepBase):
    id: str
    agent_id: str

    model_config = {
        "use_enum_values": True,
        "from_attributes": True
    }

class AgentOut(AgentCreate):
    id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    steps: List[StepOut] = []

    model_config = {
        "use_enum_values": True,
        "from_attributes": True
    }
