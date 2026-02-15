from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    def connect_to_database(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        print("Connected to MongoDB")

    def close_database_connection(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")
    
    def get_db(self):
        return self.client[settings.DB_NAME]

db = Database()

async def get_database():
    return db.get_db()
