from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List, Optional

from app.core.database import get_session
from app.models.agents import Agent,AgentStatus, AgentType
from app.schemas.agents import AgentCreate, AgentRead, AgentUpdate

router = APIRouter(prefix="/agents", tags=["Agents"])


# ░░ CREATE ░░
@router.post("/", response_model=AgentRead, status_code=status.HTTP_201_CREATED)
async def create_agent(payload: AgentCreate, db: AsyncSession = Depends(get_session)):
    agent = Agent.model_validate(payload)
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    return agent


# ░░ LIST ░░
@router.get("/", response_model=list[AgentRead])
async def list_agents(
    db: AsyncSession = Depends(get_session),
     type: Optional[AgentType] = Query(None),
    status: Optional[AgentStatus] = Query(None),
    search: Optional[str] = Query(None, description="search by name or tags"),
    skip: int = 0,
    limit: int = 50,
):
    stmt = select(Agent)

    if type:
        stmt = stmt.where(Agent.type == type)
    if status:
        stmt = stmt.where(Agent.status == status)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            (Agent.name.ilike(pattern)) | (Agent.tags.ilike(pattern))
        )

    stmt = stmt.offset(skip).limit(limit).order_by(Agent.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


# ░░ RETRIEVE ░░
@router.get("/{agent_id}", response_model=AgentRead)
async def get_agent(agent_id: int, db: AsyncSession = Depends(get_session)):
    agent = await db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


# ░░ UPDATE ░░
@router.put("/{agent_id}", response_model=AgentRead)
async def update_agent(
    agent_id: int, payload: AgentUpdate, db: AsyncSession = Depends(get_session)
):
    agent = await db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(agent, field, value)

    await db.commit()
    await db.refresh(agent)
    return agent


# ░░ DELETE ░░
@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: int, db: AsyncSession = Depends(get_session)):
    agent = await db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    await db.delete(agent)
    await db.commit()
