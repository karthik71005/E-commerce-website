from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from enum import Enum
from datetime import datetime

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItemSchema(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItemSchema]
    shipping_info: Dict

class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    items: List[OrderItemSchema]
    total_price: float
    payment_status: str
    order_status: OrderStatus
    shipping_info: Dict
    created_at: datetime
    stripe_session_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
