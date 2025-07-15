from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.core.database import get_session
from app.schemas.session import (
    SessionCreate,
    SessionUpdateClose,
    SessionOut,
)
from app.repository import session as session_crud

router = APIRouter(prefix="/sessions", tags=["Sessions"])

# ---------- create ---------------------------------------------------------
@router.post(
    "/",
    response_model=SessionOut,
    status_code=status.HTTP_201_CREATED
)
async def create_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_session)
):
    return await session_crud.create_session(db, payload)

# ---------- list -----------------------------------------------------------
@router.get("/", response_model=List[SessionOut])
async def list_sessions(
    agent_id: Optional[str] = Query(None),
    status_: Optional[str]  = Query(None, alias="status"),
    db: AsyncSession = Depends(get_session),
):
    return await session_crud.get_sessions(db, agent_id, status_)

# ---------- get one --------------------------------------------------------
@router.get("/{session_id}", response_model=SessionOut)
async def get_session(
    session_id: str = Path(...),
    db: AsyncSession = Depends(get_session)
):
    sess = await session_crud.get_session(db, session_id)
    if not sess:
        raise HTTPException(404, "Session not found")
    return sess

# ---------- close (PATCH) --------------------------------------------------
@router.patch("/{session_id}", response_model=SessionOut)
async def close_session(
    session_id: str,
    payload: SessionUpdateClose,
    db: AsyncSession = Depends(get_session)
):
    sess = await session_crud.close_session(db, session_id, payload)
    if not sess:
        raise HTTPException(404, "Session not found")
    return sess

# ---------- delete ---------------------------------------------------------
@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_session)
):
    ok = await session_crud.delete_session(db, session_id)
    if not ok:
        raise HTTPException(404, "Session not found")
