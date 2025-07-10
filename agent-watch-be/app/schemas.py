from pydantic import BaseModel
from typing import Optional

class LLMLogSchema(BaseModel):
    agent_name: str
    session_id: str
    prompt: str
    response: str
    model: str
    tokens_prompt: int
    tokens_completion: int
    total_tokens: int
    cost: float
