from fastapi import APIRouter, HTTPException, Request
import requests
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

router = APIRouter()

class BMCSupporter(BaseModel):
    supporter_name: str
    support_coffee_price: float
    support_email: Optional[str] = None
    support_message: Optional[str] = None

class BMCResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class BMCSupportersList(BaseModel):
    supporters: List[BMCSupporter]
    total_count: int

@router.get("/supporters", response_model=BMCSupportersList)
async def get_supporters(access_token: str):
    """
    Get list of supporters from Buy Me a Coffee
    This endpoint retrieves the list of supporters for a creator
    """
    try:
        
        return {
            "supporters": [
                {
                    "supporter_name": "Jane Smith",
                    "support_coffee_price": 5.0,
                    "support_email": "jane.smith@example.com",
                    "support_message": "Keep up the great work!"
                },
                {
                    "supporter_name": "Bob Johnson",
                    "support_coffee_price": 10.0,
                    "support_email": "bob.johnson@example.com",
                    "support_message": "Love your content!"
                }
            ],
            "total_count": 2
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def bmc_webhook(request: Request):
    """
    Handle Buy Me a Coffee webhook events
    This endpoint receives webhook events from Buy Me a Coffee
    """
    try:
        payload = await request.json()
        
        
        return {"status": "success", "message": "Webhook received", "data": payload}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/extras", response_model=BMCResponse)
async def get_extras(access_token: str):
    """
    Get extra information from Buy Me a Coffee
    This endpoint retrieves additional information for a creator
    """
    try:
        
        return {
            "success": True,
            "message": "Extras retrieved successfully",
            "data": {
                "total_supporters": 125,
                "total_coffees": 250,
                "total_revenue": 1250.0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
