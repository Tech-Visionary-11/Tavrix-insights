from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import LLMLog
from ..schemas import LLMLogSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/track/llm")
def track_llm(log: LLMLogSchema, db: Session = Depends(get_db)):
    new_log = LLMLog(**log.dict())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"message": "Log saved", "id": new_log.id}
