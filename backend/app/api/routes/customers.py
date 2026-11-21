from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Customer, PersonalColorResult
from app.db.session import get_db
from app.schemas.customer import (
    ColorResultRead,
    ColorTestResponse,
    CustomerCreate,
    CustomerRead,
    CustomerUpdate,
    PaymentMethodsUpdate,
    PersonalColorManualUpdate,
    PersonalColorTestSubmit,
)
from app.services.personal_color_service import get_palette, resolve_type, score_answers

router = APIRouter(prefix="/customers", tags=["customers"])


def _default_customer(db: Session) -> Customer:
    customer = db.scalar(select(Customer).order_by(Customer.id).limit(1))
    if customer is None:
        customer = Customer(code="LT-GUEST", name="Khách của Liti")
        db.add(customer)
        db.commit()
        db.refresh(customer)
    return customer


@router.post("", response_model=CustomerRead, status_code=201)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)) -> Customer:
    customer = Customer(code="LT-PENDING", name=payload.name or "Khách của Liti")
    db.add(customer)
    db.flush()
    customer.code = f"LT{customer.id:06d}"
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/me", response_model=CustomerRead)
def get_me(db: Session = Depends(get_db)) -> Customer:
    return _default_customer(db)


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: int, db: Session = Depends(get_db)) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return customer


@router.patch("/{customer_id}", response_model=CustomerRead)
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


@router.put("/{customer_id}/personal-color", response_model=CustomerRead)
def update_personal_color(
    customer_id: int, payload: PersonalColorManualUpdate, db: Session = Depends(get_db)
) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    customer.personal_color = payload.personal_color
    customer.best_colors = payload.best_colors or []
    customer.avoid_colors = payload.avoid_colors or []
    customer.color_source = "manual"
    db.commit()
    db.refresh(customer)
    return customer


@router.put("/{customer_id}/payments", response_model=CustomerRead)
def update_payments(
    customer_id: int, payload: PaymentMethodsUpdate, db: Session = Depends(get_db)
) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    customer.payment_methods = [item.model_dump() for item in payload.payment_methods]
    db.commit()
    db.refresh(customer)
    return customer


@router.post("/{customer_id}/personal-color-test", response_model=ColorTestResponse)
def submit_personal_color_test(
    customer_id: int, payload: PersonalColorTestSubmit, db: Session = Depends(get_db)
) -> ColorTestResponse:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    scores = score_answers(payload.answers)
    result_type = resolve_type(scores)
    palette = get_palette(result_type)
    result = PersonalColorResult(
        customer_id=customer_id,
        result_type=result_type,
        scores=scores,
        answers=[{"question_id": key, "option_id": value} for key, value in payload.answers.items()],
    )
    db.add(result)
    customer.personal_color = result_type
    customer.best_colors = [item["name"] for item in palette["best_colors"]] if palette else []
    customer.avoid_colors = [item["name"] for item in palette["avoid_colors"]] if palette else []
    customer.color_source = "test"
    db.commit()
    return ColorTestResponse(
        result_type=result_type,
        scores=scores,
        label=palette["label"] if palette else result_type,
        best_colors=customer.best_colors,
        avoid_colors=customer.avoid_colors,
    )


@router.get("/{customer_id}/personal-color-results", response_model=list[ColorResultRead])
def get_personal_color_results(
    customer_id: int, db: Session = Depends(get_db)
) -> list[PersonalColorResult]:
    if db.get(Customer, customer_id) is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return list(
        db.scalars(
            select(PersonalColorResult)
            .where(PersonalColorResult.customer_id == customer_id)
            .order_by(PersonalColorResult.created_at.desc())
        )
    )
