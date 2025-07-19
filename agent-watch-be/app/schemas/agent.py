from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.agent import AgentTypeEnum, AgentStatusEnum, StepTypeEnum

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

class StepUpdate(BaseModel):
    id: Optional[str]  # Provide if updating; leave out for new step
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

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    avatar_url: Optional[str] = None
    type: Optional[AgentTypeEnum] = None
    status: Optional[AgentStatusEnum] = None
    modal_config: Optional[dict] = None
    steps: Optional[List[StepUpdate]] = None  # 👈 Add this!

    model_config = {
        "use_enum_values": True
    }

# ─── Read Out ─── #
class StepOut(StepBase):
    id: str
    agent_id: str

    model_config = {
        "from_attributes": True,
        "use_enum_values": True
    }

class AgentOut(AgentCreate):
    id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    steps: List[StepOut] = []

    model_config = {
        "from_attributes": True,
        "use_enum_values": True
    }
