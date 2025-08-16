from typing import Optional
from pydantic import BaseModel, EmailStr
from enum import Enum

class Role(str, Enum):
    admin = "admin"
    manager = "manager"
    agent = "agent"
    member = "member"

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    personal: bool = True

class User(UserBase):
    id: int
    personal: bool
    org_id: Optional[int]
    role: Optional[Role]
    class Config:
        orm_mode = True

class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class OrgRegisterRequest(BaseModel):
    org: OrganizationCreate
    user: UserCreate