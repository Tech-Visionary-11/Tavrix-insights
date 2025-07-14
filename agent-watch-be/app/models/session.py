# from datetime import datetime
# from typing import Optional

# from sqlmodel import SQLModel, Field


# class Session(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     agent_id: int = Field(foreign_key="agents.id")
#     # ── timeline ──
#     started_at: datetime = Field(default_factory=datetime.utcnow)
#     ended_at: Optional[datetime] = None

#     # ── analytics ──
#     duration_seconds: Optional[int] = None          # auto‑calculated on close
#     total_tokens: int = 0
#     cost_usd: float = 0.0
#     error_count: int = 0

#     # ── status & meta ──
#     status: str = "running"                         # running | success | failed
#     tag: Optional[str] = None                       # e.g. finance, batch‑import
#     notes: Optional[str] = None
