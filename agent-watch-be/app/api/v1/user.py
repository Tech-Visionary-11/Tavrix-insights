from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models.user import User
from app.core import dependencies
from app.core.database import get_session
from app.schemas.user import User as UserSchema, Role, UserCreate


router = APIRouter(prefix="/orgs/{org_id}/users", tags=["users"])


@router.post("/", response_model=UserSchema)
async def invite_user(
    org_id: int,
    user_in: UserCreate,
    role: Role,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.role != "admin" or current_user.org_id != org_id:
        raise HTTPException(status_code=403, detail="Only admins can invite users")

    existing_user = await db.execute(
        # Needs SQLAlchemy Core or ORM query to fetch by email
        # Example using ORM Query:
        User.__table__.select().where(User.email == user_in.email)
    )
    result = existing_user.first()
    if result:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = dependencies.security.get_password_hash(user_in.password)

    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        personal=False,
        org_id=org_id,
        role=role,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.patch("/{user_id}/role", response_model=UserSchema)
async def update_user_role(
    org_id: int,
    user_id: int,
    role: Role,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.role != "admin" or current_user.org_id != org_id:
        raise HTTPException(status_code=403, detail="Only admins can update roles")

    user = await db.get(User, user_id)
    if not user or user.org_id != org_id:
        raise HTTPException(status_code=404, detail="User not found in this organization")

    user.role = role
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/", response_model=List[UserSchema])
async def list_org_users(
    org_id: int,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.org_id != org_id:
        raise HTTPException(status_code=403, detail="Not authorized to view users")

    result = await db.execute(
        User.__table__.select().where(User.org_id == org_id)
    )
    users = result.scalars().all()
    return users
