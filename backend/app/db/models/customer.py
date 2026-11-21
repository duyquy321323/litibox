"""Khách hàng và lịch sử kết quả personal color."""

from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="Khách của Liti")
    email: Mapped[str | None] = mapped_column(String(255), index=True)
    phone: Mapped[str | None] = mapped_column(String(32))
    dob: Mapped[date | None] = mapped_column(Date)
    address: Mapped[str | None] = mapped_column(String(255))

    # Hồ sơ màu sắc hiện tại
    personal_color: Mapped[str | None] = mapped_column(String(32), index=True)
    best_colors: Mapped[list[str]] = mapped_column(JSON, default=list)
    avoid_colors: Mapped[list[str]] = mapped_column(JSON, default=list)
    color_source: Mapped[str | None] = mapped_column(String(16))  # "test" | "manual"

    # [{ "label": "Vietcombank", "value": "0123456789" }]
    payment_methods: Mapped[list[dict]] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    color_results: Mapped[list["PersonalColorResult"]] = relationship(
        back_populates="customer", cascade="all, delete-orphan"
    )


class PersonalColorResult(Base):
    """Mỗi lần làm test lưu 1 bản ghi -> không ghi đè kết quả cũ."""

    __tablename__ = "personal_color_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"), index=True
    )
    result_type: Mapped[str] = mapped_column(String(32), index=True)
    scores: Mapped[dict] = mapped_column(JSON, default=dict)
    answers: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    customer: Mapped[Customer] = relationship(back_populates="color_results")
