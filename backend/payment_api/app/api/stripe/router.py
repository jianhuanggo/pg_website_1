from fastapi import APIRouter, HTTPException, Request
import stripe
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PaymentIntent(BaseModel):
    amount: int
    currency: str = "usd"
    description: Optional[str] = None

class PaymentResponse(BaseModel):
    client_secret: str
    id: str

@router.post("/create-payment-intent", response_model=PaymentResponse)
async def create_payment_intent(payment: PaymentIntent):
    """
    Create a payment intent with Stripe
    This endpoint is used to initialize a payment on the client side
    """
    try:
        stripe.api_key = "sk_test_51O1MvWLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        
        intent = stripe.PaymentIntent.create(
            amount=payment.amount,
            currency=payment.currency,
            description=payment.description,
            automatic_payment_methods={"enabled": True},
        )
        
        return {"client_secret": intent.client_secret, "id": intent.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events
    This endpoint receives webhook events from Stripe
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    webhook_secret = "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    
    try:
        
        return {"status": "success", "message": "Webhook received"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
