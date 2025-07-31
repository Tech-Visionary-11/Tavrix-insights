from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.schemas.agent import AgentCreate, AgentUpdate, AgentOut
from app.repository import agent as agent_crud

# Import user and dependencies for auth
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.post("", response_model=AgentOut)
async def create(
    agent: AgentCreate, 
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)  # Require authenticated user
):
    # Optionally: check user role/org here if needed
    return await agent_crud.create_agent(db, agent, current_user=current_user)

@router.get("", response_model=list[AgentOut])
async def list_all(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return await agent_crud.get_agents(db,current_user=current_user)

@router.get("/{agent_id}", response_model=AgentOut)
async def get(
    agent_id: str, 
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    agent = await agent_crud.get_agent(db, agent_id, current_user)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.put("/{agent_id}", response_model=AgentOut)
async def update(
    agent_id: str, 
    update: AgentUpdate, 
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Optional: enforce org or role check here before update
    agent = await agent_crud.update_agent(db, agent_id, update, current_user)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.delete("/{agent_id}")
async def delete(
    agent_id: str, 
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Optional: enforce org or role check here before delete
    agent = await agent_crud.delete_agent(db, agent_id, current_user)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Deleted"}
