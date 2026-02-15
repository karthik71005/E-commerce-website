from fastapi import APIRouter, Request, HTTPException, Header
from app.core.config import settings
from app.services.order_service import order_service
import stripe

router = APIRouter()

@router.post("/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("client_reference_id") or session.get("metadata", {}).get("order_id")
        
        if order_id:
            await order_service.update_order_status(order_id=order_id, status="paid", payment_status="paid")

    return {"status": "success"}
