from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from app.api.stripe import router as stripe_router
from app.api.patreon import router as patreon_router
from app.api.buymeacoffee import router as bmc_router

app = FastAPI(title="Payment Integration API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(stripe_router.router, prefix="/api/stripe", tags=["stripe"])
app.include_router(patreon_router.router, prefix="/api/patreon", tags=["patreon"])
app.include_router(bmc_router.router, prefix="/api/buymeacoffee", tags=["buymeacoffee"])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Payment Integration API",
        "docs": "/docs",
        "endpoints": {
            "stripe": "/api/stripe",
            "patreon": "/api/patreon",
            "buymeacoffee": "/api/buymeacoffee"
        }
    }
