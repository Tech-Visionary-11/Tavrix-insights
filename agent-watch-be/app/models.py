from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class LLMLog(Base):
    __tablename__ = "llm_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String)
    session_id = Column(String)
    prompt = Column(String)
    response = Column(String)
    model = Column(String)
    tokens_prompt = Column(Integer)
    tokens_completion = Column(Integer)
    total_tokens = Column(Integer)
    cost = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
