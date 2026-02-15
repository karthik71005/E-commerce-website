from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user_schema import UserCreate, UserResponse, Token, UserLogin
from app.services.auth_service import AuthService
from app.core.security import create_access_token, create_refresh_token
from app.api.deps import get_current_user
from typing import Any

router = APIRouter()
auth_service = AuthService()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    user = await auth_service.create_user(user_in)
    return UserResponse.from_mongo(user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user_login = UserLogin(email=form_data.username, password=form_data.password)
    user = await auth_service.authenticate_user(user_login)
    if not user:
         raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(user["_id"])
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": create_refresh_token(user["_id"])
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)) -> Any:
    """
    Get current user.
    """
    return UserResponse.from_mongo(current_user)
