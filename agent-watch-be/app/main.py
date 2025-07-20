from fastapi import FastAPI
from app.core.database import init_db
from app.api.v1 import agents ,sessions,  logs, analytics #alerts
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agent Watch API")

app.add_middleware (
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(agents.router)
app.include_router(sessions.router)
app.include_router(logs.router)
app.include_router(analytics.router)
# app.include_router(alerts.router)

@app.on_event("startup")
async def startup():
    await init_db()
