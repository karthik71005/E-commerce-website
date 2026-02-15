from sympy import limit, product, product
from app.db.client import get_database
from app.models.product_model import ProductModel
from app.schemas.product_schema import ProductCreate, ProductUpdate
from bson import ObjectId
from typing import List, Optional

class ProductService:
    def __init__(self):
        self.collection_name = "products"

    async def create_product(self, product_in: ProductCreate, user_id: str) -> dict:
        db = await get_database()
        product_data = product_in.model_dump()
        product_data["created_by"] = user_id
        
        db_product = ProductModel(**product_data)
        result = await db[self.collection_name].insert_one(db_product.model_dump(by_alias=True, exclude=["id"]))
        
        new_product = await db[self.collection_name].find_one({"_id": result.inserted_id})
        return new_product

    async def get_products(self, limit: int = 10, skip: int = 0) -> List[dict]:
        db = await get_database()
        cursor = db[self.collection_name].find().skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)

        for product in products:
            product["_id"] = str(product["_id"])

        return products


    async def get_product(self, product_id: str) -> Optional[dict]:
        db = await get_database()
        if not ObjectId.is_valid(product_id):
            return None
        product = await db[self.collection_name].find_one({"_id": ObjectId(product_id)})
        if product:
            product["_id"] = str(product["_id"])
        return product
    
    async def update_product(self, product_id: str, product_in: ProductUpdate) -> Optional[dict]:
        db = await get_database()
        if not ObjectId.is_valid(product_id):
            return None
            
        update_data = product_in.model_dump(exclude_unset=True)
        if not update_data:
            return await self.get_product(product_id)
            
        await db[self.collection_name].update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
        return await self.get_product(product_id)

    async def delete_product(self, product_id: str) -> bool:
        db = await get_database()
        if not ObjectId.is_valid(product_id):
            return False
        result = await db[self.collection_name].delete_one({"_id": ObjectId(product_id)})
        return result.deleted_count > 0

product_service = ProductService()
