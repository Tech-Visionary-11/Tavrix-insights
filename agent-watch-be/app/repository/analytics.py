from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func,case
from sqlalchemy.orm import selectinload
from typing import List
from app.models.agent import Agent
from app.models.log import SessionLog, LogTypeEnum
from app.schemas.analytics import StepperStep
from datetime import date as Date
from app.schemas.analytics import SessionVolumeEntry
from app.models.session import Session as SessionModel, SessionStatusEnum

async def get_stepper_data_for_agent(agent_id: str, db: AsyncSession) -> List[StepperStep]:
    # Eagerly load agent and its steps
    result = await db.execute(
        select(Agent).options(selectinload(Agent.steps)).where(Agent.id == agent_id)
    )
    agent = result.scalar_one_or_none()

    if not agent or agent.type.value != "workflow":
        return []

    step_data = []

    for step in agent.steps:
        # Total runs = prompts + completions
        total_runs_q = await db.execute(
            select(func.count()).where(
                SessionLog.step_code == step.code,
                SessionLog.log_type.in_([LogTypeEnum.prompt, LogTypeEnum.completion])
            )
        )
        total_runs = total_runs_q.scalar_one() or 0

        errors_q = await db.execute(
            select(func.count()).where(
                SessionLog.step_code == step.code,
                SessionLog.log_type == LogTypeEnum.error
            )
        )
        error_count = errors_q.scalar_one() or 0

        # Completion count (used for completion rate)
        completions_q = await db.execute(
            select(func.count()).where(
                SessionLog.step_code == step.code,
                SessionLog.log_type == LogTypeEnum.completion
            )
        )
        completion_count = completions_q.scalar_one() or 0

        # Prompt count (used as denominator for completion rate)
        prompts_q = await db.execute(
            select(func.count()).where(
                SessionLog.step_code == step.code,
                SessionLog.log_type == LogTypeEnum.prompt
            )
        )
        prompt_count = prompts_q.scalar_one() or 0
        completion_rate = round((completion_count / prompt_count) * 100, 2) if prompt_count else None

        # Average duration (ms → s)
        duration_q = await db.execute(
            select(func.avg(SessionLog.meta_data["duration_ms"].as_float())).where(
                SessionLog.step_code == step.code
            )
        )
        avg_ms = duration_q.scalar()
        avg_duration = round((avg_ms or 0) / 1000.0, 2) if avg_ms else None

        # Avg tokens used (prompt + completion)
        tokens_q = await db.execute(
            select(func.avg(SessionLog.tokens_used)).where(
                SessionLog.step_code == step.code,
                SessionLog.tokens_used.isnot(None)
            )
        )
        avg_tokens = tokens_q.scalar()
        avg_tokens_used = round(avg_tokens) if avg_tokens else None

        # Final output
        step_data.append(StepperStep(
            step_code=step.code,
            name=step.name,
            type=step.type.value,
            description=step.description,
            avatar=None,
            runs=total_runs,
            errors=error_count,
            avg_duration=avg_duration,
            avg_tokens_used=avg_tokens_used,
            completion_rate=completion_rate
        ))

    return step_data

async def get_session_volume_timeline(
    db: AsyncSession,
    agent_id: str,
    group_by: str = "day",
    since: Date = None,
    until: Date = None
) -> List[SessionVolumeEntry]:
    supported_groups = {"hour", "day", "week"}
    if group_by not in supported_groups:
        raise ValueError("Invalid group_by: choose from hour, day, week")

    period_expr = func.date_trunc(group_by, SessionModel.started_at).label("period")

    stmt = (
        select(
            period_expr,
            func.count().label("started"),
            func.sum(case(
            (SessionModel.status == SessionStatusEnum.completed, 1),
                else_=0
            )).label("completed"),
            func.sum(case(
                (SessionModel.status == SessionStatusEnum.error, 1),
                else_=0
            )).label("errors"),
        )
        .where(SessionModel.agent_id == agent_id)
        .group_by(period_expr)
        .order_by(period_expr.asc())
    )
    if since:
        stmt = stmt.where(SessionModel.started_at >= since)
    if until:
        stmt = stmt.where(SessionModel.started_at < until)

    results = await db.execute(stmt)
    records = results.fetchall()

    return [
        SessionVolumeEntry(
            date=row.period.date(),
            started=row.started,
            completed=row.completed,
            errors=row.errors
        )
        for row in records
    ]

async def get_session_status_breakdown(
    db: AsyncSession,
    agent_id: str,
    since=None,
    until=None
) -> dict:
    stmt = (
        select(SessionModel.status, func.count().label("count"))
        .where(SessionModel.agent_id == agent_id)
        .group_by(SessionModel.status)
    )
    if since:
        stmt = stmt.where(SessionModel.started_at >= since)
    if until:
        stmt = stmt.where(SessionModel.started_at < until)

    result = await db.execute(stmt)
    return {row.status.value: row.count for row in result.fetchall()}

async def get_cost_summary(
    db: AsyncSession,
    agent_id: str,
    since=None,
    until=None
) -> dict:
    stmt = (
        select(
            func.coalesce(func.sum(SessionModel.cost_usd), 0).label("total_cost"),
            func.count().label("session_count"),
            func.coalesce(func.avg(SessionModel.cost_usd), 0).label("avg_cost_per_session")
        )
        .where(SessionModel.agent_id == agent_id)
    )
    if since:
        stmt = stmt.where(SessionModel.started_at >= since)
    if until:
        stmt = stmt.where(SessionModel.started_at < until)
    result = await db.execute(stmt)
    row = result.fetchone()
    return {
        "total_cost": float(row.total_cost or 0),
        "session_count": row.session_count,
        "avg_cost_per_session": float(row.avg_cost_per_session or 0)
    }