# app/core/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings

from app.models.base import Base  # ⬅️ VERY IMPORTANT — import Base where Agent is defined

class Settings(BaseSettings):
    database_url: str
    class Config:
        env_file = ".env"

settings = Settings()

engine = create_async_engine(settings.database_url, echo=False)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# ✅ Use Base.metadata, NOT SQLModel.metadata
async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables created")

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
