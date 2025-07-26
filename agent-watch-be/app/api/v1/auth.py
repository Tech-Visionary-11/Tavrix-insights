from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from app.core import security
from app.core.database import get_session
from app.models.user import User, Organization
from app.schemas.user import UserCreate, OrganizationCreate, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/personal-register")
async def personal_register(user: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).filter(User.email == user.email))
    db_user = result.scalars().first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = security.get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        personal=True,
        org_id=None,
        role=None,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/org-register")
async def org_register(
    org: OrganizationCreate,
    user: UserCreate,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(select(User).filter(User.email == user.email))
    db_user = result.scalars().first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    result_org = await db.execute(select(Organization).filter(Organization.name == org.name))
    db_org = result_org.scalars().first()
    if db_org:
        raise HTTPException(status_code=400, detail="Organization name already taken")

    new_org = Organization(name=org.name)
    db.add(new_org)
    await db.commit()
    await db.refresh(new_org)

    hashed_password = security.get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        personal=False,
        org_id=new_org.id,
        role="admin",
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session),
):
    print("login")
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()
    print("user", user)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = security.create_access_token(
        data={"sub": str(user.id), "role": user.role, "org_id": user.org_id}
    )
    print("access")
    return {"access_token": access_token, "token_type": "bearer"}
