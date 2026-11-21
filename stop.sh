#!/usr/bin/env bash
# Dừng toàn bộ website.
#   ./stop.sh        -> dừng container, GIỮ dữ liệu MySQL
#   ./stop.sh -v     -> dừng container + xoá volume (mất dữ liệu)
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose)
else
  echo "❌ Không tìm thấy Docker Compose."
  exit 1
fi

case "${1:-}" in
  -v|--volumes|--hard)
    echo "==> Dừng và xoá volume (dữ liệu MySQL sẽ mất)..."
    "${DC[@]}" -f docker-compose.yml down -v --remove-orphans
    ;;
  *)
    echo "==> Dừng container (giữ nguyên dữ liệu)..."
    "${DC[@]}" -f docker-compose.yml down --remove-orphans
    ;;
esac
