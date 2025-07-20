from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import Session as SessionModel, SessionStatusEnum
from app.schemas.session import SessionCreate, SessionUpdateClose
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from app.models.agent import Agent
from fastapi import HTTPException

# ---------- create ---------------------------------------------------------
async def create_session(db: AsyncSession, data: SessionCreate) -> SessionModel:
     # 💣 Validate Agent exists
    agent_check = await db.execute(
        select(Agent).where(Agent.id == data.agent_id)
    )
    agent_obj = agent_check.scalar_one_or_none()
    
    if not agent_obj:
        raise HTTPException(status_code=400, detail="Invalid agent_id: agent does not exist")

    session = SessionModel(
        id=str(uuid.uuid4()),
        **data.dict()
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

async def get_sessions_table(
    db: AsyncSession,
    agent_id: str,
    status: str = None,
    tag: str = None,
    since: datetime = None,
    until: datetime = None,
    limit: int = 50,
    offset: int = 0
):
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
    res = await db.execute(stmt)
    return res.scalars().all()

# ---------- get one --------------------------------------------------------
async def get_session_by_id(db: AsyncSession, session_id: str) -> Optional[SessionModel]:
    res = await db.execute(
        select(SessionModel).where(SessionModel.id == session_id)
    )
    return res.scalars().first()

# ---------- close / patch --------------------------------------------------
async def close_session(
    db: AsyncSession,
    session_id: str,
    data: SessionUpdateClose
) -> Optional[SessionModel]:
    session_res = await get_session_by_id(db, session_id)
    if not session_res:
        return None

    # Only allow closing a running session
    if session_res.status != SessionStatusEnum.running:
        raise HTTPException(
        status_code=400,
        detail=f"Session is already {session_res.status}. Only running sessions can be closed."
    )

    # Apply updates
    session_res.status = SessionStatusEnum(data.status)

    if data.total_tokens is not None:
        session_res.total_tokens = data.total_tokens

    if data.cost_usd is not None:
        session_res.cost_usd = data.cost_usd

    if data.output_payload is not None:
        session_res.output_payload = data.output_payload

    if data.notes is not None:
        session_res.notes = data.notes

    session_res.ended_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(session_res)
    return session_res


# ---------- delete ---------------------------------------------------------
async def delete_session(db: AsyncSession, session_id: str) -> bool:
    session_res = await get_session_by_id(db, session_id)
    if not session_res:
        return False
    await db.delete(session_res)
    await db.commit()
    return True
