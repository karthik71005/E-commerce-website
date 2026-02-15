from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.client import db
from app.api import auth_routes, product_routes, order_routes, admin_routes, webhook_routes
from app.middleware.exception_handler import ExceptionHandlerMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.connect_to_database()
    yield
    # Shutdown
    db.close_database_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)
print("CORS ORIGINS:", settings.BACKEND_CORS_ORIGINS)

# Middleware
app.add_middleware(ExceptionHandlerMiddleware)

origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS]

# Add 127.0.0.1 variants just in case
extra_origins = []
for origin in origins:
    if "localhost" in origin:
        extra_origins.append(origin.replace("localhost", "127.0.0.1"))
origins.extend(extra_origins)

print(f"DEBUG: Allowed CORS Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Routes
app.include_router(auth_routes.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(product_routes.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(order_routes.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(admin_routes.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(webhook_routes.router, prefix="/api/webhook", tags=["webhook"]) # Note: Stripe webhook often needs raw body, so simpler prefix

@app.get("/")
async def root():
    return {"message": "Welcome to the E-commerce API"}
