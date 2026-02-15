from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    images: Optional[List[str]] = None

from app.models.user_model import PyObjectId

class ProductResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str]
    ratings: float
    reviews: List[Dict]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
