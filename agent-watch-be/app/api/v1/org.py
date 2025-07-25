from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import Organization, User
from app.core import dependencies
from app.core.database import get_session
from app.schemas.user import OrganizationCreate, Organization
from typing import List

router = APIRouter(prefix="/orgs", tags=["organizations"])


@router.post("/", response_model=Organization)
async def create_organization(
    org: OrganizationCreate,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create organizations")

    result = await db.execute(select(Organization).filter(Organization.name == org.name))
    db_org = result.scalars().first()
    if db_org:
        raise HTTPException(status_code=400, detail="Organization name already exists")

    new_org = Organization(name=org.name)
    db.add(new_org)
    await db.commit()
    await db.refresh(new_org)
    return new_org


@router.get("/{org_id}", response_model=Organization)
async def get_organization(
    org_id: int,
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(select(Organization).filter(Organization.id == org_id))
    org = result.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    if current_user.org_id != org_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this organization")

    return org


@router.get("/", response_model=List[Organization])
async def list_organizations(
    current_user: User = Depends(dependencies.get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.role == "admin":
        result = await db.execute(select(Organization))
        orgs = result.scalars().all()
    else:
        result = await db.execute(
            select(Organization).filter(Organization.id == current_user.org_id)
        )
        orgs = result.scalars().all()
    return orgs
