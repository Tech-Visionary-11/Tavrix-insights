from fastapi import FastAPI
from app.core.database import init_db
from app.api.v1 import agents 

app = FastAPI(title="Agent Watch API")

app.include_router(agents.router)
# app.include_router(sessions.router)
# app.include_router(logs.router)
# app.include_router(alerts.router)

@app.on_event("startup")
async def startup():
    await init_db()
