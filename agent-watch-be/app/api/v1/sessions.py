from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from datetime import datetime

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.session import SessionCreate, SessionUpdateClose, SessionOut
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
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Optional: check current_user role or org rights before allowing session creation
    return await session_crud.create_session(db, payload)


# ---------- list -----------------------------------------------------------
@router.get("/", response_model=List[SessionOut])
async def list_sessions(
    agent_id: str = Query(...),
    status: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    since: Optional[datetime] = Query(None),
    until: Optional[datetime] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Optional: Enforce that current_user can access this agent_id (via org membership or admin role)
    return await session_crud.get_sessions_table(db, agent_id, status, tag, since, until, limit, offset)


# ---------- get one --------------------------------------------------------
@router.get("/{session_id}", response_model=SessionOut)
async def get_session_by_id(
    session_id: str = Path(...),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    sess = await session_crud.get_session_by_id(db, session_id)
    if not sess:
        raise HTTPException(404, "Session not found")

    # Optional: check authorization - e.g., verify session belongs to user's org or user is admin
    # if current_user.role != 'admin' and sess.agent_org_id != current_user.org_id:
    #     raise HTTPException(status_code=403, detail="Not authorized to access this session")

    return sess


# ---------- close (PATCH) --------------------------------------------------
@router.patch("/{session_id}", response_model=SessionOut)
async def close_session(
    session_id: str,
    payload: SessionUpdateClose,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Optional: authorization check like above

    sess = await session_crud.close_session(db, session_id, payload)
    if not sess:
        raise HTTPException(404, "Session not found")
    return sess


# ---------- delete ---------------------------------------------------------
@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Optional: Only admins can delete session, example:
    # if current_user.role != "admin":
    #     raise HTTPException(status_code=403, detail="Only admins can delete sessions")

    ok = await session_crud.delete_session(db, session_id)
    if not ok:
        raise HTTPException(404, "Session not found")
