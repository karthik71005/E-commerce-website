from app.db.client import get_database
from app.models.order_model import OrderModel, OrderStatus
from app.schemas.order_schema import OrderCreate, OrderStatus as SchemaOrderStatus
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

class OrderService:
    def __init__(self):
        self.collection_name = "orders"

    async def create_order(self, order_in: OrderCreate, user_id: str) -> dict:
        db = await get_database()
        
        # Calculate total price
        total_price = sum(item.price * item.quantity for item in order_in.items)
        
        db_order = OrderModel(
            user_id=user_id,
            items=order_in.items,
            total_price=total_price,
            shipping_info=order_in.shipping_info
        )
        
        result = await db[self.collection_name].insert_one(db_order.model_dump(by_alias=True, exclude=["id"]))
        new_order = await db[self.collection_name].find_one({"_id": result.inserted_id})
        return new_order

    async def get_orders_by_user(self, user_id: str) -> List[dict]:
        db = await get_database()
        cursor = db[self.collection_name].find({"user_id": user_id}).sort("created_at", -1)
        orders = await cursor.to_list(length=100)
        return orders

    async def get_order(self, order_id: str) -> Optional[dict]:
        db = await get_database()
        if not ObjectId.is_valid(order_id):
            return None
        return await db[self.collection_name].find_one({"_id": ObjectId(order_id)})

    async def update_order_status(self, order_id: str, status: str, payment_status: str = None) -> Optional[dict]:
        db = await get_database()
        update_data = {"order_status": status}
        if payment_status:
            update_data["payment_status"] = payment_status
            
        await db[self.collection_name].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )
        return await self.get_order(order_id)
        
    async def update_stripe_session(self, order_id: str, session_id: str):
        db = await get_database()
        await db[self.collection_name].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"stripe_session_id": session_id}}
        )

order_service = OrderService()
