from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.schemas.order_schema import OrderCreate, OrderResponse
from app.services.order_service import order_service
from app.services.payment_service import payment_service
from app.api.deps import get_current_user
from typing import List, Any
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new order.
    """
    order = await order_service.create_order(order_in, str(current_user["_id"]))
    return order

@router.get("/my-orders", response_model=List[OrderResponse])
async def read_my_orders(
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get current user's orders.
    """
    orders = await order_service.get_orders_by_user(str(current_user["_id"]))
    return orders

@router.post("/{order_id}/checkout-session")
async def create_checkout_session(
    order_id: str,
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create Stripe checkout session for an order.
    """
    order = await order_service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if str(order["user_id"]) != str(current_user["_id"]):
         raise HTTPException(status_code=403, detail="Not authorized")
         
    session = payment_service.create_checkout_session(
        order_id=order_id,
        items=order["items"],
        success_url=f"{settings.FRONTEND_URL}/success", # We need to define FRONTEND_URL in settings or assume
        cancel_url=f"{settings.FRONTEND_URL}/cancel"
    )
    
    await order_service.update_stripe_session(order_id, session.id)
    
    return {"url": session.url}
