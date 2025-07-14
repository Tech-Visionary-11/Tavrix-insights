# from datetime import datetime
# from typing import List, Optional

# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from sqlmodel import select, col
# from sqlalchemy.ext.asyncio import AsyncSession

# from app.core.database import get_session
# from app.models.session import Session
# from app.schemas.session import SessionCreate, SessionRead, SessionUpdate

# router = APIRouter(prefix="/sessions", tags=["Sessions"])


# # ░░ CREATE ░░
# @router.post("/", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
# async def create_session(payload: SessionCreate, db: AsyncSession = Depends(get_session)):
#     session = Session.model_validate(payload)
#     if session.started_at is None:
#         session.started_at = datetime.utcnow()
#     db.add(session)
#     await db.commit()
#     await db.refresh(session)
#     return session


# # ░░ LIST ░░
# @router.get("/", response_model=List[SessionRead])
# async def list_sessions(
#     db: AsyncSession = Depends(get_session),
#     agent_id: Optional[int] = None,
#     status: Optional[str] = None,
#     tag: Optional[str] = None,
#     date_from: Optional[datetime] = Query(None),
#     date_to: Optional[datetime] = Query(None),
#     min_duration: Optional[int] = Query(None, description="seconds"),
#     max_duration: Optional[int] = Query(None, description="seconds"),
#     min_cost: Optional[float] = None,
#     max_cost: Optional[float] = None,
#     skip: int = 0,
#     limit: int = 50,
# ):
#     stmt = select(Session)

#     # ── filters ──
#     if agent_id:
#         stmt = stmt.where(Session.agent_id == agent_id)
#     if status:
#         stmt = stmt.where(Session.status == status)
#     if tag:
#         stmt = stmt.where(Session.tag == tag)
#     if date_from:
#         stmt = stmt.where(Session.started_at >= date_from)
#     if date_to:
#         stmt = stmt.where(Session.started_at <= date_to)
#     if min_duration:
#         stmt = stmt.where(Session.duration_seconds >= min_duration)
#     if max_duration:
#         stmt = stmt.where(Session.duration_seconds <= max_duration)
#     if min_cost:
#         stmt = stmt.where(Session.cost_usd >= min_cost)
#     if max_cost:
#         stmt = stmt.where(Session.cost_usd <= max_cost)

#     stmt = stmt.order_by(Session.started_at.desc()).offset(skip).limit(limit)

#     result = await db.exec(stmt)
#     return result.all()


# # ░░ RETRIEVE ░░
# @router.get("/{session_id}", response_model=SessionRead)
# async def get_session(session_id: int, db: AsyncSession = Depends(get_session)):
#     sess = await db.get(Session, session_id)
#     if not sess:
#         raise HTTPException(404, detail="Session not found")
#     return sess


# # ░░ UPDATE ░░
# @router.put("/{session_id}", response_model=SessionRead)
# async def update_session(
#     session_id: int, payload: SessionUpdate, db: AsyncSession = Depends(get_session)
# ):
#     sess = await db.get(Session, session_id)
#     if not sess:
#         raise HTTPException(404, detail="Session not found")

#     for field, value in payload.model_dump(exclude_unset=True).items():
#         setattr(sess, field, value)

#     # auto‑compute duration if ended_at provided
#     if sess.ended_at and not sess.duration_seconds:
#         sess.duration_seconds = int((sess.ended_at - sess.started_at).total_seconds())

#     await db.commit()
#     await db.refresh(sess)
#     return sess


# # ░░ DELETE ░░
# @router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_session(session_id: int, db: AsyncSession = Depends(get_session)):
#     sess = await db.get(Session, session_id)
#     if not sess:
#         raise HTTPException(404, detail="Session not found")
#     await db.delete(sess)
#     await db.commit()
