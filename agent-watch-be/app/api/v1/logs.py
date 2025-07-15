# app/routers/log.py
from fastapi import APIRouter, HTTPException, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session  # your DB dependency
from app.schemas.log import LogCreate, LogOut
 
from app.models.agent import Agent
from app.repository import log as log_crud
from app.repository import session as session_crud  # you already have
from typing import List

router = APIRouter(prefix="/sessions", tags=["Logs"])

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
):
    # Fetch session + agent
    session = await session_crud.get_session(db, session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    agent = await db.get(Agent, session.agent_id)
    if not agent:
        raise HTTPException(404, "Agent missing")

    return await log_crud.create_log(db, session, agent, data)


@router.get(
    "/{session_id}/logs",
    response_model=List[LogOut],
    summary="Get all logs for a session",
)
async def list_logs(
    session_id: str,
    db: AsyncSession = Depends(get_session),
):
    # ensure session exists
    session = await session_crud.get_session(db, session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    return await log_crud.get_logs_by_session(db, session_id)


@router.delete(
    "/{session_id}/logs",
    summary="Delete all logs in a session (admin/debug)",
)
async def delete_logs(
    session_id: str,
    db: AsyncSession = Depends(get_session),
):
    session = await session_crud.get_session(db, session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    deleted = await log_crud.delete_logs_by_session(db, session_id)
    return {"deleted": deleted}
