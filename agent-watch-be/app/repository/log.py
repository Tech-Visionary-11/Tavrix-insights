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
    tokens = data.tokens_used or 0
    cost = data.cost

    modal_config = agent.modal_config or {}
    custom_pricing = modal_config.get("custom_pricing", False)

    # Optional pricing fields
    prompt_price = modal_config.get("pricing", {}).get("prompt_price")
    completion_price = modal_config.get("pricing", {}).get("completion_price")

    # Cost calculation logic
    if cost is None and custom_pricing and data.log_type in {"prompt", "completion"}:
        if data.log_type == "prompt" and prompt_price is not None:
            cost = calculate_cost(tokens, 0, prompt_price, completion_price)
        elif data.log_type == "completion" and completion_price is not None:
            cost = calculate_cost(0, tokens, prompt_price, completion_price)

    # Create the log
    log = SessionLog(
        id=str(uuid4()),
        session_id=session.id,
        log_type=data.log_type,
        content=data.content,
        tokens_used=tokens or None,
        cost=cost or None,
        step_code=data.step_code,
        meta_data=data.meta_data
    )
    db.add(log)

    # Aggregate into session
    session.total_tokens = (session.total_tokens or 0) + (tokens or 0)
    session.cost_usd = (session.cost_usd or 0.0) + (cost or 0.0)

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
