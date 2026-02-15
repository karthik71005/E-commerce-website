from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import product_service
from app.api.deps import get_current_admin_user
from typing import List, Any

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def read_products(skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve products.
    """
    products = await product_service.get_products(skip=skip, limit=limit)
    return products

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    current_user: dict = Depends(get_current_admin_user)
) -> Any:
    """
    Create new product (Admin only).
    """
    product = await product_service.create_product(product_in, str(current_user["_id"]))
    return product

@router.get("/{product_id}", response_model=ProductResponse)
async def read_product(product_id: str) -> Any:
    """
    Get product by ID.
    """
    product = await product_service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_in: ProductUpdate,
    current_user: dict = Depends(get_current_admin_user)
) -> Any:
    """
    Update product (Admin only).
    """
    product = await product_service.update_product(product_id, product_in)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_admin_user)
) -> Any:
    """
    Delete product (Admin only).
    """
    success = await product_service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
