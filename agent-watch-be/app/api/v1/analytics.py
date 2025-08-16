from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import date

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import StepperStep, SessionVolumeEntry, CostSummary
from app.repository.analytics import (
    get_session_status_breakdown,
    get_session_volume_timeline,
    get_stepper_data_for_agent,
    get_cost_summary,
    get_agent_with_most_failures,
    get_agent_with_most_sessions,
    get_total_cost_and_top_agent,
)
from app.repository.agent import ensure_agent_accessible

router = APIRouter(prefix="/analytics", tags=["Analytics / Charts"])


@router.get("/stepper/{agent_id}", response_model=List[StepperStep])
async def get_stepper_view(
    agent_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await ensure_agent_accessible(db, agent_id, current_user)
    data = await get_stepper_data_for_agent(agent_id, db, current_user.id)
    if not data:
        raise HTTPException(404, detail="Agent not found or has no steps")
    return data


@router.get("/sessions/volume", response_model=List[SessionVolumeEntry])
async def session_volume_timeline(
    agent_id: str = Query(..., description="ID of the agent"),
    group_by: str = Query("day", enum=["hour", "day", "week"]),
    since: date = Query(None, description="Start date (YYYY-MM-DD)"),
    until: date = Query(None, description="End date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await ensure_agent_accessible(db, agent_id, current_user)
    try:
        return await get_session_volume_timeline(db, agent_id, current_user.id, group_by, since, until)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sessions/status-pie", response_model=dict)
async def session_status_breakdown(
    agent_id: str = Query(..., description="ID of the agent"),
    since: date = Query(None, description="Start date (YYYY-MM-DD)"),
    until: date = Query(None, description="End date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await ensure_agent_accessible(db, agent_id, current_user)
    return await get_session_status_breakdown(db, agent_id, current_user.id, since, until)


@router.get("/cost/summary", response_model=CostSummary)
async def cost_summary(
    agent_id: str = Query(..., description="ID of the agent"),
    since: date = Query(None, description="Start date (YYYY-MM-DD)"),
    until: date = Query(None, description="End date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await ensure_agent_accessible(db, agent_id, current_user)
    return await get_cost_summary(db, agent_id, current_user.id, since, until)


@router.get("/highlights")
async def agent_highlights(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return {
        **(await get_total_cost_and_top_agent(db, current_user.id)),
        "most_failures": await get_agent_with_most_failures(db, current_user.id),
        "most_active": await get_agent_with_most_sessions(db, current_user.id),
    }
