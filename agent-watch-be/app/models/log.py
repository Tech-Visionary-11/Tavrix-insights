from sqlalchemy import Column, String, Integer, Float, Enum, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .base import Base
from app.schemas.log import LogTypeEnum

class SessionLog(Base):
    __tablename__ = "session_logs"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id   = Column(String, ForeignKey("sessions.id"), nullable=False)
    timestamp    = Column(DateTime(timezone=True), server_default=func.now())

    log_type     = Column(Enum(LogTypeEnum), nullable=False)
    content      = Column(Text, nullable=True)         # supports large logs
    tokens_used  = Column(Integer, nullable=True)
    cost         = Column(Float, nullable=True)

    step_code    = Column(String, nullable=True)       # track which step generates this log
    meta_data = Column(JSON, nullable=True)

    session = relationship("Session", back_populates="logs")
