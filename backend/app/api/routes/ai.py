from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import AiConsultation, Customer, Product, Review
from app.db.session import get_db
from app.schemas.ai import (
    ChatAction,
    ChatRequest,
    ChatResponse,
    ConsultationRead,
    QuickReply,
    ReviewRead,
)

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    customer_id = payload.customer_id
    customer = db.get(Customer, customer_id) if customer_id else db.scalar(select(Customer).order_by(Customer.id))
    if customer is None:
        customer = Customer(code="LT-GUEST", name="Khách của Liti")
        db.add(customer)
        db.commit()
        db.refresh(customer)

    message = payload.message.lower()
    products: list[Product] = []
    query = select(Product).where(Product.stock > 0)

    if "dưới" in message:
        import re

        match = re.search(r"(\d+)\s*k", message)
        if match:
            budget = int(match.group(1)) * 1000
            from sqlalchemy import or_

            query = query.where(or_(Product.sale_price <= budget, Product.sale_price.is_(None), Product.price <= budget))

    if "gift" in message or "quà" in message:
        query = query.where(Product.is_gift_set.is_(True))
    if "combo" in message or "tiết kiệm" in message:
        query = query.where(Product.is_combo.is_(True))

    candidates = list(db.scalars(query.order_by(Product.sold.desc()).limit(6)))
    if customer.personal_color:
        candidates = [item for item in candidates if customer.personal_color in (item.personal_colors or [])]
    if "daily" in message:
        candidates = [item for item in candidates if "daily" in (item.styles or [])]
    products = candidates

    if customer.personal_color:
        reply = f"Mình đã dùng hồ sơ {customer.personal_color.replace('_', ' ').title()} của bạn để lọc lựa chọn phù hợp."
    elif "test" in message or "chưa biết" in message:
        reply = "Bạn chưa có hồ sơ màu sắc. Hãy làm bài test Personal Color để mình gợi ý chính xác hơn."
    else:
        reply = "Mình đang tìm các lựa chọn phù hợp trong catalog Litibox. Bạn có thể chọn tone, phong cách hoặc ngân sách."

    if "hết" in message or "không có" in message:
        reply = "Mình xin lỗi, sản phẩm bạn tìm có thể đã hết hoặc chưa nhập. Mình đang gợi ý sản phẩm tương tự đang còn hàng."

    quick_replies = [
        QuickReply(label="Tìm set theo tone của tôi", message="Tìm set makeup phù hợp personal color của tôi"),
        QuickReply(label="Set dưới 400k", message="Tìm set makeup daily dưới 400k"),
        QuickReply(label="Set quà tặng", message="Tìm set quà tặng kèm thiệp"),
    ]
    actions = [
        ChatAction(type="open_test", label="Làm test Personal Color", payload={"href": "/test-mau"}),
    ]
    consultation = AiConsultation(
        customer_id=customer.id,
        message=payload.message,
        reply=reply,
        meta={"personal_color": customer.personal_color, "pending": payload.pending},
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return ChatResponse(
        reply=reply,
        products=products,
        quick_replies=quick_replies,
        actions=actions,
        personal_color=customer.personal_color,
        consultation_id=consultation.id,
        pending=payload.pending,
    )


@router.get("/consultations/{customer_id}", response_model=list[ConsultationRead])
def list_consultations(customer_id: int, db: Session = Depends(get_db)) -> list[AiConsultation]:
    if db.get(Customer, customer_id) is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return list(
        db.scalars(
            select(AiConsultation)
            .where(AiConsultation.customer_id == customer_id)
            .order_by(AiConsultation.created_at.desc())
        )
    )


@router.get("/reviews", response_model=list[ReviewRead])
def list_reviews(db: Session = Depends(get_db)) -> list[Review]:
    return list(db.scalars(select(Review).order_by(Review.created_at.desc())))
