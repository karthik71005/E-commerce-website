from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId
from app.models.user_model import PyObjectId

class ProductModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str] = []
    ratings: float = 0.0
    reviews: List[Dict] = [] # List of review objects
    created_by: Optional[str] = None # User ID
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
