from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    role: UserRole
    avatar: Optional[str] = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)

    @staticmethod
    def from_mongo(data: dict):
        if not data:
            return None
        id = str(data.get("_id"))
        return UserResponse(
            _id=id,
            name=data["name"],
            email=data["email"],
            role=data["role"],
            avatar=data.get("avatar"),
            created_at=data["created_at"].isoformat()
        )

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
