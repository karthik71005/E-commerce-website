from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId
from app.models.user_model import PyObjectId

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class OrderModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    items: List[OrderItem]
    total_price: float
    payment_status: str = "unpaid"
    order_status: OrderStatus = OrderStatus.PENDING
    shipping_info: Dict
    stripe_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
