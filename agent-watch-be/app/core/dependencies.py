from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.models.user import User as DBUser
from .security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_session)
) -> DBUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        try:
            user_id = int(user_id)  # Ensure user_id is int
        except (ValueError, TypeError):
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db.get(DBUser, user_id)
    if user is None:
        raise credentials_exception
    return user

def role_required(role_name: str):
    async def dependency(user: DBUser = Depends(get_current_user)):
        if user.role != role_name:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return dependency
