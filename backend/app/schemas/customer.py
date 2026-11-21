"""Schemas cho khách hàng & hồ sơ màu sắc."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CustomerCreate(BaseModel):
    name: str | None = Field(default=None, max_length=120)


class CustomerUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    email: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=32)
    dob: date | None = None
    address: str | None = Field(default=None, max_length=255)


class PaymentMethod(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    value: str = Field(min_length=1, max_length=120)


class PaymentMethodsUpdate(BaseModel):
    payment_methods: list[PaymentMethod]


class PersonalColorManualUpdate(BaseModel):
    personal_color: str
    best_colors: list[str] | None = None
    avoid_colors: list[str] | None = None


class CustomerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    email: str | None
    phone: str | None
    dob: date | None
    address: str | None
    personal_color: str | None
    best_colors: list[str]
    avoid_colors: list[str]
    color_source: str | None
    payment_methods: list[dict]
    created_at: datetime


class ColorResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    result_type: str
    scores: dict
    created_at: datetime


class PersonalColorTestSubmit(BaseModel):
    answers: dict[str, str]


class ColorTestResponse(BaseModel):
    result_type: str
    scores: dict
    label: str
    best_colors: list[str]
    avoid_colors: list[str]
