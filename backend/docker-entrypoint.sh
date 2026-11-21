#!/usr/bin/env bash
# Entrypoint: đợi MySQL -> chạy migration -> start app
set -euo pipefail

: "${MYSQL_HOST:=db}"
: "${MYSQL_PORT:=3306}"

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Đợi MySQL tại ${MYSQL_HOST}:${MYSQL_PORT} ..."
  for _ in $(seq 1 60); do
    if python - <<'PY' >/dev/null 2>&1
import os, socket
host = os.environ.get("MYSQL_HOST", "db")
port = int(os.environ.get("MYSQL_PORT", "3306"))
with socket.create_connection((host, port), timeout=2):
    pass
PY
    then
      echo "[entrypoint] MySQL đã sẵn sàng."
      break
    fi
    sleep 2
  done

  echo "[entrypoint] Chạy alembic upgrade head ..."
  tries=0
  until alembic upgrade head; do
    tries=$((tries + 1))
    if [ "$tries" -ge 5 ]; then
      echo "[entrypoint] ❌ Alembic thất bại sau $tries lần thử."
      exit 1
    fi
    echo "[entrypoint] Alembic lỗi, thử lại ($tries/5) sau 3s ..."
    sleep 3
  done
  echo "[entrypoint] Migration hoàn tất."
  echo "[entrypoint] Seed dữ liệu mẫu ..."
  python -m app.db.seed
fi

exec "$@"
