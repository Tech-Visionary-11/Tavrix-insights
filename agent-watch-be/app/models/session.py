from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property
from enum import Enum as PyEnum
from datetime import timezone
import uuid

Base = declarative_base()

class SessionStatusEnum(PyEnum):
    running   = "running"
    completed = "completed"
    error     = "error"

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

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    ended_at   = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # ---- helpers -----------------------------------------------------------
    @hybrid_property
    def duration_seconds(self):
        if self.started_at and self.ended_at:
            return (self.ended_at - self.started_at).total_seconds()
        return None

    logs = relationship(
        "SessionLog",
        back_populates="session",
        cascade="all, delete-orphan"
    )
