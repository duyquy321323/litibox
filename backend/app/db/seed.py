"""Seed dữ liệu mẫu - idempotent, chạy 1 lần khi container backend khởi động.

Chạy tay: docker compose exec backend python -m app.db.seed
"""

from sqlalchemy import func, select

from app.db.models import Customer, Product, Review
from app.db.seed_data import PRODUCTS, REVIEWS
from app.db.session import get_session_factory


def seed() -> None:
    session = get_session_factory()()
    try:
        product_count = session.scalar(select(func.count()).select_from(Product)) or 0
        if product_count:
            print(f"[seed] đã có {product_count} sản phẩm, bỏ qua.")
        else:
            for payload in PRODUCTS:
                session.add(Product(**payload))
            session.flush()
            print(f"[seed] đã thêm {len(PRODUCTS)} sản phẩm.")

        first_product = session.scalar(select(Product).order_by(Product.id))

        review_count = session.scalar(select(func.count()).select_from(Review)) or 0
        if not review_count:
            for index, payload in enumerate(REVIEWS):
                data = dict(payload)
                if index == 0 and first_product is not None:
                    data["product_id"] = first_product.id
                session.add(Review(**data))

        customer_count = session.scalar(select(func.count()).select_from(Customer)) or 0
        if not customer_count:
            session.add(Customer(
                code="LT000001",
                name="Khách của Liti",
                personal_color="spring_warm",
                best_colors=["Peach", "Coral", "Golden"],
                avoid_colors=["Deep Navy", "Icy Silver"],
                color_source="test",
            ))

        session.commit()
        print(f"[seed] dữ liệu catalog, đánh giá và khách mẫu đã sẵn sàng.")
    finally:
        session.close()


if __name__ == "__main__":
    seed()
