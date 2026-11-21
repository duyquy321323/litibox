from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models import Product, Review
from app.db.session import get_db
from app.schemas.ai import ReviewCreate, ReviewRead
from app.schemas.product import ProductListResponse, ProductRead

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    q: str | None = None,
    category: str | None = None,
    brand: str | None = None,
    color: str | None = None,
    style: str | None = None,
    need: str | None = None,
    best_seller: bool | None = None,
    gift: bool | None = None,
    combo: bool | None = None,
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> ProductListResponse:
    query = select(Product)
    count_query = select(func.count()).select_from(Product)

    if q:
        term = f"%{q.strip()}%"
        query = query.where(Product.name.ilike(term))
        count_query = count_query.where(Product.name.ilike(term))
    if category:
        query = query.where(Product.category == category)
        count_query = count_query.where(Product.category == category)
    if brand:
        query = query.where(Product.brand == brand)
        count_query = count_query.where(Product.brand == brand)
    if style:
        query = query.where(func.json_contains(Product.styles, f'"{style}"'))
        count_query = count_query.where(func.json_contains(Product.styles, f'"{style}"'))
    if color:
        query = query.where(func.json_contains(Product.personal_colors, f'"{color}"'))
        count_query = count_query.where(func.json_contains(Product.personal_colors, f'"{color}"'))
    if need:
        query = query.where(func.json_contains(Product.needs, f'"{need}"'))
        count_query = count_query.where(func.json_contains(Product.needs, f'"{need}"'))
    if best_seller is not None:
        query = query.where(Product.is_best_seller == best_seller)
        count_query = count_query.where(Product.is_best_seller == best_seller)
    if gift is not None:
        query = query.where(Product.is_gift_set == gift)
        count_query = count_query.where(Product.is_gift_set == gift)
    if combo is not None:
        query = query.where(Product.is_combo == combo)
        count_query = count_query.where(Product.is_combo == combo)

    total = db.scalar(count_query) or 0
    brands = list(db.scalars(select(Product.brand).distinct().order_by(Product.brand)))
    items = db.scalars(query.order_by(Product.sold.desc(), Product.id).offset(offset).limit(limit))
    return ProductListResponse(items=list(items), total=total, brands=brands)


@router.get("/slug/{slug}", response_model=ProductRead)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)) -> Product:
    product = db.scalar(select(Product).where(Product.slug == slug))
    if product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product


@router.get("/{product_id}/reviews", response_model=list[ReviewRead])
def get_reviews(product_id: int, db: Session = Depends(get_db)) -> list[Review]:
    return list(db.scalars(select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())))


@router.post("/{product_id}/reviews", response_model=ReviewRead, status_code=201)
def create_review(product_id: int, payload: ReviewCreate, db: Session = Depends(get_db)) -> Review:
    if db.get(Product, product_id) is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    review = Review(product_id=product_id, **payload.model_dump(exclude={"product_id"}))
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
