import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def reset_db():
    print("Resetting database users...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    
    # Delete admin user
    result = await db.users.delete_many({"email": settings.FIRST_SUPERUSER_EMAIL})
    print(f"Deleted {result.deleted_count} users (admin).")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(reset_db())
