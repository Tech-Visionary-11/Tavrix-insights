from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.schemas.agent import AgentCreate, AgentUpdate, AgentOut
from app.repository import agent as agent_crud

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.post("", response_model=AgentOut)
async def create(agent: AgentCreate, db: AsyncSession = Depends(get_session)):
    return await agent_crud.create_agent(db, agent)

@router.get("", response_model=list[AgentOut])
async def list_all(db: AsyncSession = Depends(get_session)):
    return await agent_crud.get_agents(db)

@router.get("/{agent_id}", response_model=AgentOut)
async def get(agent_id: str, db: AsyncSession = Depends(get_session)):
    agent = await agent_crud.get_agent(db, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.put("/{agent_id}", response_model=AgentOut)
async def update(agent_id: str, update: AgentUpdate, db: AsyncSession = Depends(get_session)):
    agent = await agent_crud.update_agent(db, agent_id, update)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.delete("/{agent_id}")
async def delete(agent_id: str, db: AsyncSession = Depends(get_session)):
    agent = await agent_crud.delete_agent(db, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Deleted"}
