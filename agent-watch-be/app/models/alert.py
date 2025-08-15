
from sqlalchemy import Boolean, Float
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .enum import AlertChannelEnum
from .base import Base


class AlertConfig(Base):
    __tablename__ = "agent_alert_configs"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))

    agent_id = Column(String, ForeignKey("agents.id"), nullable=False, unique=True)

    enabled = Column(Boolean, nullable=False, default=False)

    channel = Column(Enum(AlertChannelEnum), nullable=True)

    alert_email = Column(String, nullable=True)      # Used if channel == email
    webhook_url = Column(String, nullable=True)      # Used if channel == slack/webhook

    failure_threshold = Column(Integer, nullable=True)  # Number of failures triggers alert
    cost_threshold = Column(Float, nullable=True)       # Daily cost threshold in USD

    notes = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    agent = relationship("Agent", back_populates="alert_config")
