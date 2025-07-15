# app/crud/log.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.log import SessionLog, LogTypeEnum
from app.models.session import Session, SessionStatusEnum
from app.models.agent import Agent  # assuming the model path
from app.schemas.log import LogCreate
from typing import List
from uuid import uuid4

from app.core.pricing import calculate_cost

async def create_log(
    db: AsyncSession,
    session: Session,
    agent: Agent,
    data: LogCreate,
) -> SessionLog:
    # Fill missing tokens/cost if needed
    tokens = data.tokens_used or 0
    cost   = data.cost

    if cost is None and agent.custom_pricing and data.log_type in {"prompt", "completion"}:
        if data.log_type == "prompt":
            cost = calculate_cost(tokens, 0, agent.prompt_price, agent.completion_price)
        elif data.log_type == "completion":
            cost = calculate_cost(0, tokens, agent.prompt_price, agent.completion_price)

    log = SessionLog(
        id=str(uuid4()),
        session_id=session.id,
        log_type=data.log_type,
        content=data.content,
        tokens_used=tokens or None,
        cost=cost or None,
    )
    db.add(log)

    # ---- aggregate into Session ----
    if tokens:
        session.total_tokens += tokens
    if cost:
        session.cost_usd += cost
    if data.log_type == LogTypeEnum.error:
        session.error_count += 1
        if session.status == SessionStatusEnum.running:
            session.status = SessionStatusEnum.error

    await db.commit()
    await db.refresh(log)
    return log


async def get_logs_by_session(db: AsyncSession, session_id: str) -> List[SessionLog]:
    res = await db.execute(
        select(SessionLog).where(SessionLog.session_id == session_id).order_by(SessionLog.timestamp)
    )
    return res.scalars().all()


async def delete_logs_by_session(db: AsyncSession, session_id: str) -> int:
    res = await db.execute(
        select(SessionLog).where(SessionLog.session_id == session_id)
    )
    logs = res.scalars().all()
    deleted = len(logs)
    for l in logs:
        await db.delete(l)
    await db.commit()
    return deleted
