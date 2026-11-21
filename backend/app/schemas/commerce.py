"""Schemas giỏ hàng & đơn hàng."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.product import ProductRead


class CartItemCreate(BaseModel):
    product_id: int | None = None
    slug: str | None = None
    quantity: int = Field(default=1, ge=1, le=99)
    note: str | None = Field(default=None, max_length=500)


class CartItemUpdate(BaseModel):
    quantity: int | None = Field(default=None, ge=1, le=99)
    note: str | None = Field(default=None, max_length=500)


class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quantity: int
    note: str | None
    product: ProductRead


class CartRead(BaseModel):
    items: list[CartItemRead]
    subtotal: Decimal
    discount: Decimal
    shipping_fee: Decimal
    free_ship_remaining: Decimal
    total: Decimal
    voucher_code: str | None
    total_quantity: int


class OrderItemInput(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=99)
    note: str | None = Field(default=None, max_length=500)


class OrderCreate(BaseModel):
    items: list[OrderItemInput] | None = None
    cart_item_ids: list[int] | None = None
    voucher_code: str | None = None
    payment_method: str = "cod"
    note: str | None = Field(default=None, max_length=2000)
    receiver_name: str | None = None
    receiver_phone: str | None = None
    receiver_address: str | None = None


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_code: str
    product_name: str
    brand: str
    image: str | None
    unit_price: Decimal
    quantity: int
    note: str | None


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    status: str
    subtotal: Decimal
    discount: Decimal
    shipping_fee: Decimal
    total: Decimal
    voucher_code: str | None
    payment_method: str
    note: str | None
    receiver_name: str
    receiver_phone: str
    receiver_address: str
    created_at: datetime
    items: list[OrderItemRead]


class OrderStatusUpdate(BaseModel):
    status: str
