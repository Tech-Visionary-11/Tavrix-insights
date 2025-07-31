from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate
import uuid
import datetime
from app.models.agent import Agent, Step
from sqlalchemy.orm import selectinload
from app.models.user import User
from fastapi import HTTPException
# ─── Create Agent ─── #
async def create_agent(db: AsyncSession, agent: AgentCreate, current_user: User):
    new_agent = Agent(
        id=str(uuid.uuid4()),
        name=agent.name,
        role=None,
        description=agent.description,
        tags=agent.tags,
        avatar_url=agent.avatar_url,
        type=agent.type,
        status=agent.status,
        modal_config=agent.modal_config,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
        owner_user_id=current_user.id if current_user.personal else None,
        org_id=current_user.org_id if not current_user.personal else None
    )

    db.add(new_agent)

    if agent.steps:
        for step_data in agent.steps:
            new_step = Step(
                id=str(uuid.uuid4()),
                agent=new_agent,
                code=step_data.code,
                name=step_data.name,
                type=step_data.type,
                description=step_data.description,
                success_criteria=step_data.success_criteria,
                order=step_data.order,
                modal_config=step_data.modal_config
            )
            db.add(new_step)

    await db.commit()

    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == new_agent.id)
    )
    return result.scalar_one()

# ─── Get All ─── #
async def get_agents(db: AsyncSession, current_user: User):
    stmt = select(Agent).options(selectinload(Agent.steps))
    
    if current_user.personal:
        stmt = stmt.where(Agent.owner_user_id == current_user.id)
    else:
        stmt = stmt.where(Agent.org_id == current_user.org_id)

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_agent(db: AsyncSession, agent_id: str, current_user: User):
    stmt = select(Agent).options(selectinload(Agent.steps)).where(Agent.id == agent_id)

    if current_user.personal:
        stmt = stmt.where(Agent.owner_user_id == current_user.id)
    else:
        stmt = stmt.where(Agent.org_id == current_user.org_id)

    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def update_agent(db: AsyncSession, agent_id: str, data: AgentUpdate, current_user: User):
    agent = await get_agent(db, agent_id, current_user)
    if not agent:
        return None

    for key, value in data.dict(exclude_unset=True, exclude={"steps"}).items():
        setattr(agent, key, value)

    if data.steps is not None:
        current_steps = {s.id: s for s in agent.steps}
        steps_to_keep = set()

        for step_update in data.steps:
            if step_update.id and step_update.id in current_steps:
                step = current_steps[step_update.id]
                for key, value in step_update.dict(exclude_unset=True).items():
                    setattr(step, key, value)
                steps_to_keep.add(step_update.id)
            else:
                new_step = Step(
                    id=str(uuid.uuid4()),
                    agent_id=agent.id,
                    code=step_update.code,
                    name=step_update.name,
                    type=step_update.type,
                    description=step_update.description,
                    success_criteria=step_update.success_criteria,
                    order=step_update.order,
                    modal_config=step_update.modal_config
                )
                db.add(new_step)

        for step_id, step in current_steps.items():
            if step_id not in steps_to_keep:
                await db.delete(step)

    agent.updated_at = datetime.datetime.utcnow()
    await db.commit()

    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == agent_id)
    )
    return result.scalar_one()



# ─── Delete Agent ─── #
async def delete_agent(db: AsyncSession, agent_id: str, current_user: User):
    agent = await get_agent(db, agent_id, current_user)
    if agent:
        await db.delete(agent)
        await db.commit()
    return agent

async def ensure_agent_accessible(db: AsyncSession, agent_id: str, user: User) -> Agent:
    stmt = select(Agent).where(Agent.id == agent_id)

    if user.personal:
        stmt = stmt.where(Agent.owner_user_id == user.id)
    else:
        stmt = stmt.where(Agent.org_id == user.org_id)

    result = await db.execute(stmt)
    agent = result.scalar_one_or_none()

    if not agent:
        raise HTTPException(status_code=403, detail="Agent not accessible or not found")

    return agent