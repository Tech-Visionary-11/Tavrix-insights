from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate
import uuid
import datetime
from app.models.agent import Agent, Step
from sqlalchemy.orm import selectinload
# ─── Create Agent ─── #
async def create_agent(db: AsyncSession, agent: AgentCreate):
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
        updated_at=datetime.datetime.utcnow()
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

    # Commit first
    await db.commit()

    # ✅ Re-fetch the agent with steps loaded (avoids MissingGreenlet)
    result = await db.execute(
        select(Agent)
        .options(selectinload(Agent.steps))
        .where(Agent.id == new_agent.id)
    )
    return result.scalar_one()

# ─── Get All ─── #
async def get_agents(db: AsyncSession):
    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps))
    )
    return result.scalars().all()

async def get_agent(db: AsyncSession, agent_id: str):
    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == agent_id)
    )
    return result.scalar_one_or_none()
async def update_agent(db: AsyncSession, agent_id: str, data: AgentUpdate):
    agent = await get_agent(db, agent_id)
    if not agent:
        return None

    # Update agent fields
    for key, value in data.dict(exclude_unset=True, exclude={"steps"}).items():
        setattr(agent, key, value)

    # Handle step updates
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
                # New step
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

        # Delete orphaned steps
        for step_id, step in current_steps.items():
            if step_id not in steps_to_keep:
                await db.delete(step)

    agent.updated_at = datetime.datetime.utcnow()
    await db.commit()

    # ✅ Re-fetch with eager-loaded steps to avoid greenlet error
    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == agent_id)
    )
    return result.scalar_one()


# ─── Delete Agent ─── #
async def delete_agent(db: AsyncSession, agent_id: str):
    agent = await get_agent(db, agent_id)
    if agent:
        await db.delete(agent)
        await db.commit()
    return agent