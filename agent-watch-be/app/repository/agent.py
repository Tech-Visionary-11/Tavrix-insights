from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate
import uuid
import datetime

async def create_agent(db: AsyncSession, agent: AgentCreate):
    new_agent = Agent(
        id=str(uuid.uuid4()),
        **agent.dict(),
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )
    db.add(new_agent)
    await db.commit()
    await db.refresh(new_agent)
    return new_agent


async def get_agents(db: AsyncSession):
    result = await db.execute(select(Agent))
    return result.scalars().all()


async def get_agent(db: AsyncSession, agent_id: str):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    return result.scalar_one_or_none()


async def update_agent(db: AsyncSession, agent_id: str, data: AgentUpdate):
    agent = await get_agent(db, agent_id)
    if agent:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(agent, key, value)
        agent.updated_at = datetime.datetime.utcnow()
        await db.commit()
        await db.refresh(agent)
    return agent


async def delete_agent(db: AsyncSession, agent_id: str):
    agent = await get_agent(db, agent_id)
    if agent:
        await db.delete(agent)
        await db.commit()
    return agent
