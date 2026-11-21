"""Sản phẩm mỹ phẩm (không có kem nền) & set makeup."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import JSON, Boolean, DateTime, Float, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    brand: Mapped[str] = mapped_column(String(80), index=True)
    brand_segment: Mapped[str] = mapped_column(String(16), default="mid")  # low | mid | high

    # lip | blush | eye | set | care | highlight
    category: Mapped[str] = mapped_column(String(24), index=True)
    # daily | party | soft (chỉ dùng cho set & sản phẩm lẻ)
    styles: Mapped[list[str]] = mapped_column(JSON, default=list)
    personal_colors: Mapped[list[str]] = mapped_column(JSON, default=list)
    needs: Mapped[list[str]] = mapped_column(JSON, default=list)  # daily, party, gift...

    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    sale_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    stock: Mapped[int] = mapped_column(Integer, default=0)
    tone_hex: Mapped[str | None] = mapped_column(String(9))

    short_description: Mapped[str | None] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(String(2000))
    details: Mapped[list[str]] = mapped_column(JSON, default=list)
    images: Mapped[list[str]] = mapped_column(JSON, default=list)

    rating: Mapped[float] = mapped_column(Float, default=4.8)
    sold: Mapped[int] = mapped_column(Integer, default=0)
    is_best_seller: Mapped[bool] = mapped_column(Boolean, default=False)
    is_gift_set: Mapped[bool] = mapped_column(Boolean, default=False)
    is_combo: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    @property
    def discount_percent(self) -> int:
        if not self.sale_price or not self.price:
            return 0
        remaining = 100 - int(float(self.sale_price) * 100 / float(self.price))
        return max(remaining, 0)

    @property
    def effective_price(self) -> Decimal:
        return self.sale_price if self.sale_price else self.price
