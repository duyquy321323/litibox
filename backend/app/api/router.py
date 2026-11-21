from fastapi import APIRouter

from app.api.routes import ai, commerce, customers, health, products

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(products.router)
api_router.include_router(customers.router)
api_router.include_router(commerce.router)
api_router.include_router(ai.router)
