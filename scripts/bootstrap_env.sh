#!/usr/bin/env bash
# ------------------------------------------------------------------
# Sinh file .env / backend/.env / frontend/.env.local từ *.env.example
# - Idempotent: file nào đã có thì giữ nguyên (không ghi đè key bạn đã dán)
# - Chỉ sinh secret ngẫu nhiên cho các placeholder __GENERATE_*__
# ------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

rand_hex() {
  local bytes="${1:-24}"
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$bytes"
  elif [ -r /dev/urandom ]; then
    od -An -tx1 -N "$bytes" /dev/urandom | tr -d ' \n'
  else
    printf '%s%s%s%s' "${RANDOM}${RANDOM}" "${RANDOM}${RANDOM}" "${RANDOM}" "${RANDOM}"
  fi
}

MYSQL_PASSWORD="$(rand_hex 16)"
MYSQL_ROOT_PASSWORD="$(rand_hex 16)"
SECRET_KEY="$(rand_hex 32)"

render() {
  local src="$1" dst="$2" content
  content="$(cat "$src")"
  content="${content//__GENERATE_MYSQL_PASSWORD__/$MYSQL_PASSWORD}"
  content="${content//__GENERATE_MYSQL_ROOT_PASSWORD__/$MYSQL_ROOT_PASSWORD}"
  content="${content//__GENERATE_SECRET_KEY__/$SECRET_KEY}"
  printf '%s\n' "$content" > "$dst"
}

ensure_env() {
  local example="$1" target="$2" label="$3"
  if [ -f "$target" ]; then
    echo "    - $label: đã tồn tại, giữ nguyên"
  elif [ -f "$example" ]; then
    render "$example" "$target"
    echo "    - $label: đã tạo từ $example"
  else
    echo "    - $label: thiếu file $example (bỏ qua)"
  fi
}

echo "==> Kiểm tra file môi trường"
ensure_env ".env.example" ".env" ".env"
ensure_env "backend/.env.example" "backend/.env" "backend/.env"
ensure_env "frontend/.env.example" "frontend/.env.local" "frontend/.env.local"

echo "==> Xong. Muốn đổi cấu hình: sửa .env (hoặc backend/.env) rồi chạy lại ./start.sh"
