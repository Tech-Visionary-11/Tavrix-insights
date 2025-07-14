# crud/agent.py
from sqlalchemy.orm import Session
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate
import uuid


def create_agent(db: Session, agent: AgentCreate):
    new_agent = Agent(id=str(uuid.uuid4()), **agent.dict())
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    return new_agent


def get_agents(db: Session):
    return db.query(Agent).all()


def get_agent(db: Session, agent_id: str):
    return db.query(Agent).filter(Agent.id == agent_id).first()


def update_agent(db: Session, agent_id: str, data: AgentUpdate):
    agent = get_agent(db, agent_id)
    if agent:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(agent, key, value)
        db.commit()
        db.refresh(agent)
    return agent


def delete_agent(db: Session, agent_id: str):
    agent = get_agent(db, agent_id)
    if agent:
        db.delete(agent)
        db.commit()
    return agent
