from app.db.client import get_database
from app.models.user_model import UserModel, UserRole
from app.schemas.user_schema import UserCreate, UserLogin, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from fastapi import HTTPException, status
from bson import ObjectId

class AuthService:
    def __init__(self):
        self.collection_name = "users"

    async def create_user(self, user_in: UserCreate):
        db = await get_database()
        existing_user = await db[self.collection_name].find_one({"email": user_in.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        hashed_password = get_password_hash(user_in.password)
        db_user = UserModel(
            name=user_in.name,
            email=user_in.email,
            hashed_password=hashed_password,
            role=UserRole.USER
        )
        
        result = await db[self.collection_name].insert_one(db_user.model_dump(by_alias=True, exclude=["id"]))
        
        new_user = await db[self.collection_name].find_one({"_id": result.inserted_id})
        return new_user

    async def authenticate_user(self, login_data: UserLogin):
        db = await get_database()
        user = await db[self.collection_name].find_one({"email": login_data.email})
        if not user or not verify_password(login_data.password, user["hashed_password"]):
            return None
        return user

auth_service = AuthService()
