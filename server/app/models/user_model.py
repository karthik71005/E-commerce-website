from pydantic import BaseModel, Field, EmailStr, ConfigDict
from enum import Enum
from typing import Optional
from datetime import datetime
from bson import ObjectId

from typing import Annotated, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.union_schema(
            [
                core_schema.str_schema(),
                core_schema.is_instance_schema(ObjectId),
            ],
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

# Better approach for V2 if simple string conversion is desired:
# PyObjectId = Annotated[str, BeforeValidator(str)] 
# But let's stick to the class to avoid breaking other imports that might rely on it being a class (though they shouldn't).
# Actually, the error was 'Input should be a valid string'.
# The previous implementation lacked serialization. I added it above.


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    hashed_password: str
    role: UserRole = UserRole.USER
    avatar: Optional[str] = None
    reset_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
