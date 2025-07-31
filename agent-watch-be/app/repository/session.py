from typing import Optional, List
from uuid import uuid4
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.session import Session as SessionModel, SessionStatusEnum
from app.models.agent import Agent
from app.models.user import User
from app.schemas.session import SessionCreate, SessionUpdateClose
from app.repository.agent import ensure_agent_accessible


# ---------------------------- Create Session ----------------------------
async def create_session(db: AsyncSession, data: SessionCreate, current_user: User) -> SessionModel:
    """
    Create a new session for an agent.
    """
    # Validate if the agent exists
    result = await db.execute(select(Agent).where(Agent.id == data.agent_id))
    agent_obj = result.scalar_one_or_none()

    if not agent_obj:
        raise HTTPException(status_code=400, detail="Invalid agent_id: Agent does not exist")

    # Check agent access permissions
    await ensure_agent_accessible(db, data.agent_id, current_user)

    # Create the session
    session = SessionModel(
        id=str(uuid4()),
        **data.dict()
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


# ---------------------------- Get Sessions Table ----------------------------
async def get_sessions_table(
    db: AsyncSession,
    agent_id: str,
    status: Optional[str] = None,
    tag: Optional[str] = None,
    since: Optional[datetime] = None,
    until: Optional[datetime] = None,
    limit: int = 50,
    offset: int = 0
) -> List[SessionModel]:
    """
    Get a paginated list of sessions for a specific agent, filtered by optional parameters.
    """
    stmt = select(SessionModel).where(SessionModel.agent_id == agent_id)

    if status:
        stmt = stmt.where(SessionModel.status == status)

    if tag:
        stmt = stmt.where(SessionModel.tag == tag)

    if since:
        stmt = stmt.where(SessionModel.started_at >= since)

    if until:
        stmt = stmt.where(SessionModel.started_at < until)

    stmt = stmt.order_by(SessionModel.started_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()


# ---------------------------- Get Single Session ----------------------------
async def get_session_by_id(db: AsyncSession, session_id: str) -> Optional[SessionModel]:
    """
    Fetch a session by its ID.
    """
    result = await db.execute(select(SessionModel).where(SessionModel.id == session_id))
    return result.scalars().first()


# ---------------------------- Close (Patch) Session ----------------------------
async def close_session(
    db: AsyncSession,
    session_id: str,
    data: SessionUpdateClose
) -> Optional[SessionModel]:
    """
    Close a running session and update its metadata.
    """
    session = await get_session_by_id(db, session_id)

    if not session:
        return None

    if session.status != SessionStatusEnum.running:
        raise HTTPException(
            status_code=400,
            detail=f"Session is already {session.status}. Only running sessions can be closed."
        )

    # Apply updates
    session.status = SessionStatusEnum(data.status)
    session.ended_at = datetime.now(timezone.utc)

    if data.total_tokens is not None:
        session.total_tokens = data.total_tokens

    if data.cost_usd is not None:
        session.cost_usd = data.cost_usd

    if data.output_payload is not None:
        session.output_payload = data.output_payload

    if data.notes is not None:
        session.notes = data.notes

    await db.commit()
    await db.refresh(session)
    return session


# ---------------------------- Delete Session ----------------------------
async def delete_session(db: AsyncSession, session_id: str) -> bool:
    """
    Delete a session by its ID.
    """
    session = await get_session_by_id(db, session_id)

    if not session:
        return False

    await db.delete(session)
    await db.commit()
    return True
