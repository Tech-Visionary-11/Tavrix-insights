# app/models/session_log.py
from sqlalchemy import Column, String, Integer, Float, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import uuid

Base = declarative_base()

class LogTypeEnum(PyEnum):
    prompt      = "prompt"
    completion  = "completion"
    error       = "error"
    info        = "info"

class SessionLog(Base):
    __tablename__ = "session_logs"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id   = Column(String, ForeignKey("sessions.id"), nullable=False)
    timestamp    = Column(DateTime(timezone=True), server_default=func.now())

    log_type     = Column(Enum(LogTypeEnum), nullable=False)
    content      = Column(String)            # raw prompt / completion / stack‑trace
    tokens_used  = Column(Integer)
    cost         = Column(Float)

    session = relationship("Session", back_populates="logs")
