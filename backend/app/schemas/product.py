"""Schemas sản phẩm."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    slug: str
    name: str
    brand: str
    brand_segment: str
    category: str
    styles: list[str]
    personal_colors: list[str]
    needs: list[str]
    price: Decimal
    sale_price: Decimal | None
    discount_percent: int
    effective_price: Decimal
    stock: int
    tone_hex: str | None
    short_description: str | None
    description: str | None
    details: list[str]
    images: list[str]
    rating: float
    sold: int
    is_best_seller: bool
    is_gift_set: bool
    is_combo: bool


class ProductListResponse(BaseModel):
    items: list[ProductRead]
    total: int
    brands: list[str]
