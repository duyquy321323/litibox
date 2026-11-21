# BTL TMĐT — Base skeleton (FastAPI + Next.js + MySQL)

Base source cho website thương mại điện tử:

- **Backend**: FastAPI + SQLAlchemy 2 + Alembic + MySQL 8 (`backend/`)
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (`frontend/`)
- **Hạ tầng**: Docker Compose (3 service: `db`, `backend`, `frontend`)

> Mục tiêu: `git clone` xong chỉ cần **1 lệnh** là website chạy, không phải cài Node/Python/MySQL,
> không phải tạo file `.env` thủ công.

---

## 1. Yêu cầu

| Phần mềm | Bắt buộc | Ghi chú |
|---|---|---|
| Docker Desktop | ✅ | Bản có Docker Compose **v2.24+** (dùng `env_file.required`) |
| Git | ✅ | Để clone |
| Git Bash (Windows) | ⬜ | Có sẵn khi cài Git for Windows; dùng cho `start.sh` |
| Node.js / Python / MySQL | ❌ | **Không cần** — tất cả chạy trong container |

---

## 2. Chạy website trong 1 lệnh

### macOS / Linux / Git Bash (Windows)

```bash
git clone <repo-url> btl
cd btl

# chỉ cần ở lần đầu, để script có quyền thực thi
chmod +x start.sh stop.sh scripts/bootstrap_env.sh backend/docker-entrypoint.sh

./start.sh
```

### Windows (CMD / PowerShell)

```bat
start.bat
```

Lần chạy đầu tiên sẽ mất vài phút (pull image MySQL/Node/Python + build). Khi xong, terminal in ra:

```
Frontend : http://localhost:3000
API docs : http://localhost:8000/docs
API health: http://localhost:8000/api/health
```

Nhấn `Ctrl + C` để thoát chế độ xem log — **container vẫn chạy**. Dừng hẳn bằng `./stop.sh`.

### `start.sh` làm gì?

1. Kiểm tra Docker daemon đang chạy.
2. Chạy `scripts/bootstrap_env.sh`:
   - `.env` (cấu hình compose) ← `.env.example`
   - `backend/.env` (secret, key bên thứ ba) ← `backend/.env.example`
   - `frontend/.env.local` (khi muốn chạy Next.js ngoài Docker) ← `frontend/.env.example`
   - Sinh ngẫu nhiên `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `SECRET_KEY`.
   - **Không ghi đè** file đã tồn tại → dán key vào rồi chạy lại vẫn giữ nguyên.
3. Build & start `db` → `backend` (tự chạy `alembic upgrade head`) → `frontend`.
4. Chờ healthcheck rồi in URL truy cập.

### Tuỳ chọn

```bash
./start.sh                 # dev: hot reload (mặc định)
./start.sh prod            # production: Next.js build standalone
./start.sh --fresh         # xoá volume (mất dữ liệu MySQL) rồi dựng lại
./start.sh --no-build      # không build lại image
./start.sh --no-follow     # chạy nền, không xem log
./stop.sh                  # dừng, giữ dữ liệu
./stop.sh -v               # dừng + xoá dữ liệu
```

---

## 3. Cấu trúc dự án

```
BTL/
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── main.py              # create_app + CORS + router
│   │   ├── core/config.py       # Settings (pydantic-settings)
│   │   ├── db/                  # base, session, models/
│   │   ├── schemas/             # Pydantic request/response
│   │   ├── services/            # logic nghiệp vụ
│   │   └── api/routes/          # health, items
│   ├── alembic/                 # migration (tự chạy khi container start)
│   ├── tests/                   # pytest (SQLite in-memory)
│   ├── Dockerfile               # stage dev / runtime
│   └── docker-entrypoint.sh     # đợi MySQL → alembic upgrade head → uvicorn
│
├── frontend/                    # Next.js App Router
│   ├── app/                     # layout, page, /items
│   ├── components/ui/           # shadcn/ui components
│   ├── lib/                     # api.ts, config.ts, utils.ts
│   ├── types/api.ts
│   ├── components.json          # cấu hình shadcn (thêm component bằng CLI)
│   └── Dockerfile               # stage dev / builder / runtime
│
├── docker-compose.yml           # base
├── docker-compose.override.yml  # dev: bind mount + hot reload (tự merge)
├── docker-compose.prod.yml      # production
├── scripts/bootstrap_env.sh     # sinh .env tự động
├── start.sh / start.bat         # chạy tất cả
├── stop.sh
├── .cursor/rules/               # quy ước cho AI agent / dev
└── README.md
```

---

## 4. Biến môi trường

### `.env` (thư mục gốc — cấu hình hạ tầng, compose tự đọc)

| Biến | Mặc định | Mô tả |
|---|---|---|
| `FRONTEND_PORT` | `3000` | Cổng truy cập web |
| `BACKEND_PORT` | `8000` | Cổng API / Swagger |
| `MYSQL_PORT` | `3307` | Cổng MySQL ra host (3307 để không đụng MySQL có sẵn) |
| `MYSQL_DATABASE` | `btl` | Tên database |
| `MYSQL_USER` | `btl` | User MySQL |
| `MYSQL_PASSWORD` | *tự sinh* | Mật khẩu user MySQL |
| `MYSQL_ROOT_PASSWORD` | *tự sinh* | Mật khẩu root MySQL |
| `APP_ENV` | `development` | `development` / `production` |
| `DEBUG` | `true` | Bật debug |
| `APP_VERSION` | `0.1.0` | Version API |
| `RUN_MIGRATIONS` | `true` | Tự chạy migration khi start |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Origin được phép gọi API (phân tách bằng `,`) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL API cho **trình duyệt** |
| `API_INTERNAL_URL` | `http://backend:8000` | URL API cho **server component** (trong Docker) |

### `backend/.env` (secret của ứng dụng)

| Biến | Mặc định | Mô tả |
|---|---|---|
| `SECRET_KEY` | *tự sinh* | Khoá bí mật (dùng cho JWT/session sau này) |
| `CORS_ORIGINS` | như trên | Ghi đè CORS nếu cần |
| `RUN_MIGRATIONS` | `true` | Chạy Alembic khi container start |

Các biến `MYSQL_*` khi chạy Docker được compose truyền từ `.env` gốc (một nguồn duy nhất).
Trong `backend/.env.example` có sẵn phần comment để chạy backend trực tiếp trên máy.

> **Đổi mật khẩu MySQL**: sửa `MYSQL_PASSWORD` trong `.env` → `./start.sh --fresh`
> (volume cũ giữ mật khẩu cũ nên cần tạo lại DB).

---

## 5. Biến phải tự điền sau (key bên thứ ba)

Mở `backend/.env`, bỏ comment và điền giá trị, sau đó chạy lại `./start.sh`.
Không có key thì các tính năng tương ứng chỉ đơn giản là chưa dùng tới — web vẫn chạy.

| Nhóm chức năng | Biến cần điền |
|---|---|
| Gửi email (xác thực, quên mật khẩu) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` |
| Thanh toán VNPay | `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_URL` |
| Thanh toán MoMo | `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY` |
| Đăng nhập Google/Facebook | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` |
| Lưu ảnh sản phẩm (Cloudinary/S3) | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

Cách hoạt động: `docker compose` nạp `backend/.env` vào container qua `env_file`.
Sửa file xong chạy `./start.sh --no-build` (container sẽ được tạo lại với env mới).

---

## 6. Quy trình phát triển

Code được bind mount → sửa file là hot reload (Next.js Turbopack / uvicorn `--reload`).

| Việc cần làm | Lệnh |
|---|---|
| Xem log | `docker compose logs -f backend frontend` |
| Shell backend | `docker compose exec backend bash` |
| Shell frontend | `docker compose exec frontend sh` |
| Chạy test backend | `docker compose exec backend pytest` |
| Typecheck frontend | `docker compose exec frontend pnpm typecheck` |
| Thêm thư viện Python | sửa `backend/requirements.txt` → `./start.sh --build` |
| Thêm thư viện JS | `docker compose exec frontend pnpm add <pkg>` → commit `package.json` → `./start.sh --build` |
| Thêm component shadcn | `docker compose exec frontend pnpm dlx shadcn@latest add input` |
| Tạo migration mới | `docker compose exec backend alembic revision --autogenerate -m "add products"` |
| Áp migration | `docker compose exec backend alembic upgrade head` |
| Kết nối MySQL từ máy | host `127.0.0.1`, port `3307` (user/pass trong `.env`) |

### Thêm endpoint mới (tóm tắt)

1. Model → `backend/app/db/models/<name>.py` + import trong `models/__init__.py`.
2. Schema → `backend/app/schemas/<name>.py`.
3. Logic → `backend/app/services/<name>_service.py`.
4. Router → `backend/app/api/routes/<name>.py` + include trong `app/api/router.py`.
5. Migration → `alembic revision --autogenerate`, review file sinh ra.
6. Test → `backend/tests/test_<name>.py`.
7. Frontend → thêm hàm gọi qua `apiFetch()` + type trong `frontend/types/api.ts`.

Chi tiết quy ước: xem `.cursor/rules/`.

---

## 7. Chạy production

```bash
./start.sh prod
```

- Backend: image `runtime` (không reload, chạy `uvicorn --workers 2`, user không phải root).
- Frontend: `next build` → image chỉ chứa output `standalone`(`node server.js`).
- Không bind mount source code.

Lưu ý: `NEXT_PUBLIC_API_URL` được nhúng vào bundle lúc **build**, nên khi đổi domain phải
`./start.sh prod --build` lại.

---

## 8. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| `Docker daemon chưa chạy` | Mở Docker Desktop, chờ icon chuyển xanh rồi chạy lại |
| `port is already allocated` | Đổi `FRONTEND_PORT`/`BACKEND_PORT`/`MYSQL_PORT` trong `.env` |
| Backend lỗi `Access denied for user` | Mật khẩu DB đã đổi nhưng volume cũ → `./start.sh --fresh` |
| Trang web trắng, log frontend báo không gọi được API | Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env` (phải là URL trình duyệt truy cập được) |
| Hot reload không ăn trên Windows | Đã bật `WATCHPACK_POLLING`/`CHOKIDAR_USEPOLLING`; nếu vẫn lỗi: `docker compose restart frontend` |
| Muốn reset sạch | `./stop.sh -v && ./start.sh` |
| Xem container nào lỗi | `docker compose ps` + `docker compose logs <service>` |

Các lệnh chẩn đoán nhanh:

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/health/db
docker compose ps
```

---

## 9. Bước phát triển tiếp theo (gợi ý)

- [ ] Auth: đăng ký/đăng nhập JWT (thêm `users` table + `passlib`/`pyjwt`)
- [ ] Sản phẩm: danh mục, ảnh, tồn kho
- [ ] Giỏ hàng, đơn hàng, trạng thái đơn
- [ ] Tìm kiếm + phân trang
- [ ] Trang admin (CRUD)
- [ ] Upload ảnh (Cloudinary/S3)
- [ ] Thanh toán VNPay/MoMo sandbox

Khi thêm bất kỳ biến môi trường mới, nhớ cập nhật `.env.example` + bảng ở mục 4.

