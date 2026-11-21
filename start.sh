#!/usr/bin/env bash
# ==============================================================
#  Chạy toàn bộ website (MySQL + FastAPI + Next.js) bằng 1 lệnh.
#
#  ./start.sh              -> dev (hot reload, mặc định)
#  ./start.sh prod         -> production build
#  ./start.sh --fresh      -> xoá volume DB rồi dựng lại từ đầu
#  ./start.sh --no-follow  -> không theo dõi log sau khi chạy
#  ./start.sh --no-build   -> không build lại image (chạy nhanh)
# ==============================================================
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="dev"
DO_BUILD=1
DO_FOLLOW=1
DO_FRESH=0

usage() {
  cat <<'EOF'
Cách dùng: ./start.sh [dev|prod] [tuỳ chọn]

  dev               Chạy môi trường phát triển (mặc định)
  prod              Chạy bản production (Next.js standalone)
  --build           Build lại image trước khi chạy (mặc định: có)
  --no-build        Bỏ qua bước build
  --fresh           Xoá container + volume (mất dữ liệu MySQL) rồi dựng lại
  --no-follow, -d   Chạy nền, không theo dõi log
  -h, --help        Hiển thị trợ giúp
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    dev|--dev) MODE="dev" ;;
    prod|production|--prod) MODE="prod" ;;
    --build) DO_BUILD=1 ;;
    --no-build) DO_BUILD=0 ;;
    --fresh) DO_FRESH=1 ;;
    --no-follow|-d|--detach) DO_FOLLOW=0 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "❌ Tham số không hợp lệ: $1"; echo; usage; exit 1 ;;
  esac
  shift
done

# ---------- 1. Kiểm tra Docker ----------
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Không tìm thấy Docker. Hãy cài Docker Desktop: https://docs.docker.com/get-docker/"
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose)
else
  echo "❌ Không tìm thấy Docker Compose. Cần Docker Compose v2 (>= 2.24)."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker daemon chưa chạy. Hãy mở Docker Desktop rồi chạy lại lệnh này."
  exit 1
fi

# ---------- 2. Sinh file môi trường (không ghi đè cái đã có) ----------
bash scripts/bootstrap_env.sh

# ---------- 3. Chuẩn bị tham số compose ----------
COMPOSE_FILES=(-f docker-compose.yml)
if [ "$MODE" = "prod" ]; then
  COMPOSE_FILES+=(-f docker-compose.prod.yml)
else
  COMPOSE_FILES+=(-f docker-compose.override.yml)
fi

compose() {
  "${DC[@]}" "${COMPOSE_FILES[@]}" "$@"
}

if [ "$DO_FRESH" = "1" ]; then
  echo "==> Xoá container và volume (dữ liệu MySQL sẽ mất)..."
  compose down -v --remove-orphans || true
fi

# ---------- 4. Build & chạy ----------
echo "==> Dựng website ở chế độ: $MODE"
if [ "$DO_BUILD" = "1" ]; then
  compose build
fi

compose up -d --remove-orphans

# ---------- 5. Đợi service healthy ----------
wait_for_healthy() {
  local service="$1" tries="${2:-90}" i status
  for i in $(seq 1 "$tries"); do
    status="$(compose ps --format '{{.Service}} {{.Health}}' 2>/dev/null | awk -v s="$service" '$1==s {print $2}')"
    if [ "$status" = "healthy" ]; then
      return 0
    fi
    sleep 2
  done
  return 1
}

echo "==> Đợi backend & database sẵn sàng..."
if wait_for_healthy backend 90; then
  echo "    ✔ backend healthy"
else
  echo "    ⚠ backend chưa healthy sau ~3 phút. Xem log: ${DC[*]} logs backend"
fi

if wait_for_healthy frontend 90; then
  echo "    ✔ frontend healthy"
else
  echo "    ⚠ frontend chưa healthy. Next.js lần đầu build có thể mất vài phút."
fi

# ---------- 6. In thông tin truy cập ----------
FRONTEND_PORT="$(grep -E '^FRONTEND_PORT=' .env 2>/dev/null | cut -d= -f2 || true)"
BACKEND_PORT="$(grep -E '^BACKEND_PORT=' .env 2>/dev/null | cut -d= -f2 || true)"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-8000}"

cat <<EOF

==============================================================
  🚀 Website đang chạy ($MODE)

  Frontend : http://localhost:${FRONTEND_PORT}
  API docs : http://localhost:${BACKEND_PORT}/docs
  API health: http://localhost:${BACKEND_PORT}/api/health

  Dừng     : ./stop.sh          (giữ dữ liệu)
  Dừng + xoá DB: ./stop.sh -v
  Xem log  : ${DC[*]} logs -f
==============================================================

EOF

# ---------- 7. Theo dõi log (Ctrl+C để thoát, container vẫn chạy) ----------
if [ "$DO_FOLLOW" = "1" ]; then
  compose logs -f --tail=60
fi
