from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
class AlertRule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_id: int = Field(foreign_key="agent.id")
    kind: str               # cost_threshold / failure_rate / token_usage …
    config: dict            # JSON field (threshold, window, email …)
    enabled: bool = True

class AlertEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rule_id: int = Field(foreign_key="alertrule.id")
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    status: str             # sent / failed
    detail: Optional[str] = None
