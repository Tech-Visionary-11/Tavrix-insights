from fastapi import APIRouter, HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from typing import List

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.models.agent import Agent
from app.models.user import User
from app.schemas.log import LogCreate, LogOut
from app.repository import log as log_crud
from app.repository import session as session_crud


router = APIRouter(prefix="/sessions", tags=["Logs"])


async def check_session_permission(db: AsyncSession, session_id: str, user: User):
    session = await session_crud.get_session_by_id(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get the agent and preload steps
    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == session.agent_id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # Example permission check: user must be admin or in same org as agent
    if user.role != "admin" and user.org_id != agent.org_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this session")

    return session, agent


@router.post(
    "/{session_id}/logs",
    response_model=LogOut,
    status_code=201,
    summary="Append a log entry to a session",
)
async def create_log(
    session_id: str = Path(..., description="Target session ID"),
    data: LogCreate = ...,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session, agent = await check_session_permission(db, session_id, current_user)

    step_codes = {step.code for step in agent.steps}
    if data.step_code not in step_codes:
        raise HTTPException(status_code=400, detail=f"Invalid step code: {data.step_code}")

    return await log_crud.create_log(db, session, agent, data)


@router.get(
    "/{session_id}/logs",
    response_model=List[LogOut],
    summary="Get all logs for a session",
)
async def list_logs(
    session_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session, _ = await check_session_permission(db, session_id, current_user)

    return await log_crud.get_logs_by_session(db, session_id)


@router.delete(
    "/{session_id}/logs",
    summary="Delete all logs in a session (admin/debug)",
)
async def delete_logs(
    session_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session, _ = await check_session_permission(db, session_id, current_user)

    # Only admin users allowed to delete logs
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete logs")

    deleted = await log_crud.delete_logs_by_session(db, session_id)
    return {"deleted": deleted}
