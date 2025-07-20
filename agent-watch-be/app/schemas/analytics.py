# app/schemas/analytics.py

from pydantic import BaseModel
from typing import Optional,Dict
from datetime import date

class StepperStep(BaseModel):
    step_code: str
    name: str
    type: str
    description: Optional[str]
    avatar: Optional[str]
    runs: int
    errors: int
    avg_duration: Optional[float]
    avg_tokens_used: Optional[int]
    completion_rate: Optional[float]  # % prompt-completion match

class SessionVolumeEntry(BaseModel):
    date: date
    started: int
    completed: int
    errors: int

class SessionStatusBreakdown(BaseModel):
    status_counts: Dict[str, int]

class CostSummary(BaseModel):
    total_cost: float
    session_count: int
    avg_cost_per_session: float