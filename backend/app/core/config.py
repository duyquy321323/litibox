"""Cấu hình ứng dụng, đọc từ biến môi trường / file .env.

Mọi giá trị đều có default an toàn để app vẫn chạy được khi chưa có .env.
"""

from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---------- App ----------
    app_name: str = "BTL API"
    app_env: str = "development"
    app_version: str = "0.1.0"
    debug: bool = True
    api_prefix: str = "/api"
    secret_key: str = "dev-secret-key-please-change"
    # Danh sách origin cách nhau bởi dấu phẩy
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # ---------- Database ----------
    mysql_host: str = "db"
    mysql_port: int = 3306
    mysql_user: str = "btl"
    mysql_password: str = "btlpassword"
    mysql_database: str = "btl"
    # Nếu được set (VD: khi test) thì dùng luôn, bỏ qua các biến MYSQL_*
    database_url: str | None = None

    @property
    def sqlalchemy_url(self) -> str:
        if self.database_url:
            return self.database_url
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}?charset=utf8mb4"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
