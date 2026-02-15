import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    def create_checkout_session(self, order_id: str, items: list, success_url: str, cancel_url: str):
        line_items = []
        for item in items:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item.name,
                        'images': [item.image] if item.image else [],
                    },
                    'unit_amount': int(item.price * 100), # Amount in cents
                },
                'quantity': item.quantity,
            })
            
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=cancel_url,
                client_reference_id=order_id,
                metadata={"order_id": order_id}
            )
            return checkout_session
        except Exception as e:
            print(f"Error creating Stripe session: {e}")
            raise e

    def retrieve_session(self, session_id: str):
        return stripe.checkout.Session.retrieve(session_id)

payment_service = PaymentService()
