from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import Session, SessionStatusEnum
from app.schemas.session import SessionCreate, SessionUpdateClose
from typing import List, Optional
from datetime import datetime, timezone
import uuid

# ---------- create ---------------------------------------------------------
async def create_session(db: AsyncSession, data: SessionCreate) -> Session:
    session = Session(
        id=str(uuid.uuid4()),
        **data.dict()
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

# ---------- list -----------------------------------------------------------
async def get_sessions(
    db: AsyncSession,
    agent_id: Optional[str] = None,
    status:   Optional[str] = None
) -> List[Session]:
    stmt = select(Session)
    if agent_id:
        stmt = stmt.where(Session.agent_id == agent_id)
    if status:
        stmt = stmt.where(Session.status == status)
    res = await db.execute(stmt)
    return res.scalars().all()

# ---------- get one --------------------------------------------------------
async def get_session(db: AsyncSession, session_id: str) -> Optional[Session]:
    res = await db.execute(select(Session).where(Session.id == session_id))
    return res.scalars().first()

# ---------- close / patch --------------------------------------------------
async def close_session(
    db: AsyncSession,
    session_id: str,
    data: SessionUpdateClose
) -> Optional[Session]:
    session = await get_session(db, session_id)
    if not session:
        return None

    # Only allow closing a running session
    if session.status != SessionStatusEnum.running:
        return session

    # Apply updates
    session.status = SessionStatusEnum(data.status)

    if data.total_tokens is not None:
        session.total_tokens = data.total_tokens

    if data.cost_usd is not None:
        session.cost_usd = data.cost_usd

    if data.output_payload is not None:
        session.output_payload = data.output_payload

    if data.notes is not None:
        session.notes = data.notes

    session.ended_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(session)
    return session


# ---------- delete ---------------------------------------------------------
async def delete_session(db: AsyncSession, session_id: str) -> bool:
    session = await get_session(db, session_id)
    if not session:
        return False
    await db.delete(session)
    await db.commit()
    return True
