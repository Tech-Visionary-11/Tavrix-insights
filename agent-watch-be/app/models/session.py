from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum, DateTime,JSON
from sqlalchemy.orm import  relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property
from enum import Enum as PyEnum
import uuid
from app.models.log import SessionLog
from .base import Base


class SessionStatusEnum(str,PyEnum):
    running   = "running"
    completed = "completed"
    error     = "error"
    cancelled = "cancelled"

class Session(Base):
    __tablename__ = "sessions"

    id        = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id  = Column(String, ForeignKey("agents.id"), nullable=False)

    tag       = Column(String, nullable=True)
    notes     = Column(String, nullable=True)
    status    = Column(Enum(SessionStatusEnum), default=SessionStatusEnum.running)

    total_tokens = Column(Integer, default=0)
    cost_usd     = Column(Float,   default=0.0)
    error_count  = Column(Integer, default=0)
    input_payload = Column(JSON, nullable=True)
    output_payload = Column(JSON, nullable=True) # Optional: result from the run
    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    ended_at   = Column(
        DateTime(timezone=True),
        nullable=True
    )
    
    logs = relationship(SessionLog, back_populates="session", cascade="all, delete-orphan")
    # ---- helpers -----------------------------------------------------------
    @hybrid_property
    def duration_seconds(self):
        if self.started_at and self.ended_at:
            return (self.ended_at - self.started_at).total_seconds()
        return None
