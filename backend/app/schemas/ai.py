"""Schemas cho AI agent & đánh giá."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.product import ProductRead


class QuickReply(BaseModel):
    label: str
    message: str


class ChatRequest(BaseModel):
    customer_id: int | None = None
    message: str = Field(min_length=1, max_length=1000)
    pending: dict | None = None


class ChatAction(BaseModel):
    type: str  # add_note | open_test | open_product | apply_voucher
    label: str
    payload: dict = Field(default_factory=dict)


class ChatResponse(BaseModel):
    reply: str
    products: list[ProductRead] = Field(default_factory=list)
    quick_replies: list[QuickReply] = Field(default_factory=list)
    actions: list[ChatAction] = Field(default_factory=list)
    voucher: str | None = None
    personal_color: str | None = None
    consultation_id: int | None = None
    pending: dict | None = None


class ConsultationRead(BaseModel):
    id: int
    message: str
    reply: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    personal_color: str | None = None
    rating: int = Field(default=5, ge=1, le=5)
    content: str = Field(min_length=1, max_length=600)
    product_id: int | None = None


class ReviewRead(BaseModel):
    id: int
    customer_name: str
    personal_color: str | None
    rating: int
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
