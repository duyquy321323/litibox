from decimal import Decimal
import random

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constants import FREE_SHIP_THRESHOLD, VOUCHERS
from app.core.constants import ORDER_STATUS_ORDER
from app.db.models import CartItem, Customer, Order, OrderEvent, OrderItem, Product
from app.db.session import get_db
from app.schemas.commerce import (
    CartItemCreate,
    CartItemRead,
    CartItemUpdate,
    CartRead,
    OrderCreate,
    OrderRead,
    OrderStatusUpdate,
)

router = APIRouter(tags=["commerce"])


def _customer(db: Session, customer_id: int) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return customer


def _quote(db: Session, customer_id: int, voucher_code: str | None = None) -> tuple[list[CartItem], Decimal, Decimal, Decimal, Decimal, str | None]:
    items = list(db.scalars(select(CartItem).where(CartItem.customer_id == customer_id)))
    subtotal = Decimal("0")
    for item in items:
        product = db.get(Product, item.product_id)
        if product:
            subtotal += (product.sale_price or product.price) * item.quantity

    discount = Decimal("0")
    code = voucher_code.upper() if voucher_code else None
    if code in VOUCHERS:
        voucher = VOUCHERS[code]
        if subtotal >= Decimal(str(voucher["min_total"])):
            if voucher["type"] == "percent":
                discount = subtotal * Decimal(str(voucher["value"])) / Decimal("100")
    shipping = Decimal("0") if subtotal >= Decimal(str(FREE_SHIP_THRESHOLD)) else Decimal("30000")
    total = max(subtotal - discount, Decimal("0")) + shipping
    return items, subtotal, discount, shipping, total, code


@router.get("/cart/{customer_id}", response_model=CartRead)
def get_cart(
    customer_id: int,
    db: Session = Depends(get_db),
    voucher_code: str | None = None,
) -> CartRead:
    _customer(db, customer_id)
    items, subtotal, discount, shipping, total, code = _quote(db, customer_id, voucher_code)
    lines = []
    for item in items:
        product = db.get(Product, item.product_id)
        if product:
            lines.append(CartItemRead.model_validate({"id": item.id, "quantity": item.quantity, "note": item.note, "product": product}))
    return CartRead(
        items=lines,
        subtotal=subtotal,
        discount=discount,
        shipping_fee=shipping,
        free_ship_remaining=max(Decimal(str(FREE_SHIP_THRESHOLD)) - subtotal, Decimal("0")),
        total=total,
        voucher_code=code,
        total_quantity=sum(line.quantity for line in lines),
    )


@router.post("/cart/{customer_id}/items", response_model=CartItemRead, status_code=201)
def add_cart_item(customer_id: int, payload: CartItemCreate, db: Session = Depends(get_db)) -> CartItemRead:
    _customer(db, customer_id)
    product = db.get(Product, payload.product_id) if payload.product_id else db.scalar(
        select(Product).where(Product.slug == payload.slug)
    )
    if product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    if product.stock <= 0:
        raise HTTPException(status_code=409, detail="Sản phẩm hiện đã hết hàng")

    item = db.scalar(
        select(CartItem).where(CartItem.customer_id == customer_id, CartItem.product_id == product.id)
    )
    if item:
        item.quantity = min(item.quantity + payload.quantity, 99)
        if payload.note is not None:
            item.note = payload.note
    else:
        item = CartItem(
            customer_id=customer_id,
            product_id=product.id,
            quantity=payload.quantity,
            note=payload.note,
        )
        db.add(item)
    db.commit()
    db.refresh(item)
    return CartItemRead.model_validate({"id": item.id, "quantity": item.quantity, "note": item.note, "product": product})


@router.patch("/cart/{customer_id}/items/{item_id}", response_model=CartItemRead)
def update_cart_item(
    customer_id: int, item_id: int, payload: CartItemUpdate, db: Session = Depends(get_db)
) -> CartItemRead:
    item = db.get(CartItem, item_id)
    if item is None or item.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Không tìm thấy dòng giỏ hàng")
    if payload.quantity is not None:
        item.quantity = payload.quantity
    if payload.note is not None:
        item.note = payload.note
    db.commit()
    db.refresh(item)
    product = db.get(Product, item.product_id)
    return CartItemRead.model_validate({"id": item.id, "quantity": item.quantity, "note": item.note, "product": product})


@router.delete("/cart/{customer_id}/items/{item_id}", status_code=204)
def delete_cart_item(customer_id: int, item_id: int, db: Session = Depends(get_db)) -> None:
    item = db.get(CartItem, item_id)
    if item is None or item.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Không tìm thấy dòng giỏ hàng")
    db.delete(item)
    db.commit()


@router.post("/orders", response_model=OrderRead, status_code=201)
def create_order(
    payload: OrderCreate,
    customer_id: int = Query(default=1),
    db: Session = Depends(get_db),
) -> Order:
    _customer(db, customer_id)
    selected: list[tuple[Product, int, str | None]]
    if payload.cart_item_ids:
        lines = list(db.scalars(select(CartItem).where(CartItem.id.in_(payload.cart_item_ids))))
        selected = []
        for line in lines:
            product = db.get(Product, line.product_id)
            if product:
                selected.append((product, line.quantity, line.note))
    elif payload.items:
        selected = []
        for line in payload.items:
            product = db.get(Product, line.product_id)
            if product:
                selected.append((product, line.quantity, line.note))
    else:
        raise HTTPException(status_code=400, detail="Đơn hàng không có sản phẩm")

    if not selected:
        raise HTTPException(status_code=400, detail="Không có sản phẩm hợp lệ")

    for product, quantity, _ in selected:
        if product.stock < quantity:
            raise HTTPException(status_code=409, detail=f"Sản phẩm {product.name} không đủ tồn kho")

    subtotal = sum(((product.sale_price or product.price) * quantity for product, quantity, _ in selected), Decimal("0"))
    discount = Decimal("0")
    code = payload.voucher_code.upper() if payload.voucher_code else None
    if code in VOUCHERS:
        voucher = VOUCHERS[code]
        if subtotal >= Decimal(str(voucher["min_total"])) and voucher["type"] == "percent":
            discount = subtotal * Decimal(str(voucher["value"])) / Decimal("100")
    shipping = Decimal("0") if subtotal >= Decimal(str(FREE_SHIP_THRESHOLD)) else Decimal("30000")
    total = subtotal - discount + shipping
    order_code = f"LT{random.randint(10000000, 99999999)}"
    order = Order(
        code=order_code,
        customer_id=customer_id,
        status="pending",
        subtotal=subtotal,
        discount=discount,
        shipping_fee=shipping,
        total=total,
        voucher_code=code,
        payment_method=payload.payment_method,
        note=payload.note,
        receiver_name=payload.receiver_name or "Khách của Liti",
        receiver_phone=payload.receiver_phone or "",
        receiver_address=payload.receiver_address or "",
    )
    db.add(order)
    db.flush()
    for product, quantity, note in selected:
        db.add(OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_code=product.code,
            product_name=product.name,
            brand=product.brand,
            image=(product.images[0] if product.images else None),
            unit_price=product.sale_price or product.price,
            quantity=quantity,
            note=note,
        ))
        product.stock -= quantity
    db.add(OrderEvent(order_id=order.id, status="pending", note="Đơn hàng vừa được tạo"))
    db.commit()
    db.refresh(order)
    if payload.cart_item_ids:
        for item_id in payload.cart_item_ids:
            item = db.get(CartItem, item_id)
            if item and item.customer_id == customer_id:
                db.delete(item)
        db.commit()
    return order


@router.get("/orders", response_model=list[OrderRead])
def list_orders(customer_id: int = Query(default=1), db: Session = Depends(get_db)) -> list[Order]:
    _customer(db, customer_id)
    return list(db.scalars(select(Order).where(Order.customer_id == customer_id).order_by(Order.created_at.desc())))


@router.get("/orders/lookup/{code}", response_model=OrderRead)
def lookup_order(code: str, db: Session = Depends(get_db)) -> Order:
    order = db.scalar(select(Order).where(Order.code == code))
    if order is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    return order


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)) -> Order:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    if payload.status not in ORDER_STATUS_ORDER:
        raise HTTPException(status_code=400, detail="Trạng thái đơn hàng không hợp lệ")
    order.status = payload.status
    db.add(OrderEvent(order_id=order.id, status=payload.status, note="Cập nhật trạng thái"))
    db.commit()
    db.refresh(order)
    return order
