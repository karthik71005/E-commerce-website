import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user_model import UserRole
from app.models.product_model import ProductModel
from datetime import datetime

async def seed_db():
    print("Seeding database...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    
    # 1. Create Admin User
    admin_email = settings.FIRST_SUPERUSER_EMAIL
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_data = {
            "name": "Super Admin",
            "email": admin_email,
            "hashed_password": get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            "role": UserRole.ADMIN,
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_data)
        print(f"Admin user created: {admin_email}")
    else:
        print("Admin user already exists.")

    # 2. Create Sample Products
    if await db.products.count_documents({}) == 0:
        products_data = [
            {
                "name": "Smartphone X",
                "description": "Latest smartphone with cutting-edge features.",
                "price": 999.99,
                "category": "Electronics",
                "stock": 50,
                "images": ["https://via.placeholder.com/300"],
            },
            {
                "name": "Laptop Pro",
                "description": "High-performance laptop for professionals.",
                "price": 1499.99,
                "category": "Electronics",
                "stock": 30,
                "images": ["https://via.placeholder.com/300"],
            },
            {
                "name": "Wireless Headphones",
                "description": "Noise-cancelling wireless headphones.",
                "price": 199.99,
                "category": "Audio",
                "stock": 100,
                "images": ["https://via.placeholder.com/300"],
            }
        ]
        
        # Validate and transform using ProductModel to ensure all fields (defaults) are present
        products_to_insert = []
        for p_data in products_data:
            # We need to handle creation time locally or let model default it (but model default is factory)
            # ProductModel has created_at default factory.
            # We also need created_by? Seed products might not have a user, or use admin ID.
            # ProductResponse doesn't mandate created_by?
            # Let's check ProductModel. created_by is Optional[str] = None.
            
            # Note: ProductModel might need alias handling if we pass _id? We aren't passing _id.
            
            p_model = ProductModel(**p_data)
            products_to_insert.append(p_model.model_dump(by_alias=True, exclude=["id"]))

        await db.products.insert_many(products_to_insert)
        print(f"Seeded {len(products_to_insert)} products.")
    else:
        print("Products already exist.")

    client.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    print("Starting seed script...")
    try:
        asyncio.run(seed_db())
        print("Seed script finished successfully.")
    except Exception as e:
        print(f"Seed script failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
