"""Kết nối database (SQLAlchemy 2.x).

Engine được tạo lazy để:
- app import không cần MySQL đang chạy (tiện cho test / build image)
- test có thể override dependency `get_db` bằng SQLite in-memory
"""

from collections.abc import Generator

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.sqlalchemy_url,
            pool_pre_ping=True,
            pool_recycle=1800,
            future=True,
        )
    return _engine


def get_session_factory() -> sessionmaker[Session]:
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=get_engine(),
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )
    return _session_factory


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: mở 1 session cho mỗi request."""
    db = get_session_factory()()
    try:
        yield db
    finally:
        db.close()
