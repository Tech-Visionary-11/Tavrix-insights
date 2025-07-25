from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum as SqlEnum
from .base import Base

class RoleEnum(str, PyEnum):
    admin = "admin"
    manager = "manager"
    agent = "agent"
    member = "member"

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    personal = Column(Boolean, default=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    role = Column(SqlEnum(RoleEnum, name="role"), nullable=True)
