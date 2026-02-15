from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core.config import settings
from app.core.security import ALGORITHM
from app.db.client import get_database
from app.models.user_model import UserModel, UserRole
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = payload.get("sub")
        if token_data is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
        
    db = await get_database()
    user = await db.users.find_one({"_id": ObjectId(token_data)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    return current_user

async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
