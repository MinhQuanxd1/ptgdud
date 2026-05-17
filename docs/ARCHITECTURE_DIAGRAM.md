# Diagram kiến trúc

## 1. Kiến trúc tổng thể

```mermaid
flowchart LR
  U[User/Admin Browser] --> FE[Next.js Client]
  FE -->|REST API / fetch| BE[Express.js Server]
  BE -->|Mongoose| DB[(MongoDB Local - shopdb)]
  BE --> UP[Local Uploads Folder]

  FE --> PAGES[App Router Pages]
  PAGES --> HOME[Home / Products / Product Detail]
  PAGES --> AUTH[Login / Register / Profile]
  PAGES --> ADMIN[Admin Dashboard]

  BE --> AUTHAPI[Auth API]
  BE --> PRODUCTAPI[Product API]
  BE --> ORDERAPI[Order API]
  BE --> USERAPI[User API]
  BE --> STATSAPI[Stats API]
  BE --> UPLOADAPI[Upload API]
```

## 2. Luồng đăng nhập

```mermaid
sequenceDiagram
  participant User
  participant NextClient
  participant ExpressAPI
  participant MongoDB

  User->>NextClient: Nhập email/password
  NextClient->>ExpressAPI: POST /api/auth/login
  ExpressAPI->>MongoDB: Tìm user theo email
  MongoDB-->>ExpressAPI: User document
  ExpressAPI->>ExpressAPI: bcrypt.compare + jwt.sign
  ExpressAPI-->>NextClient: token + public user
  NextClient->>NextClient: Lưu token/user vào localStorage
  NextClient-->>User: Chuyển trang theo role
```

## 3. Luồng đặt hàng

```mermaid
sequenceDiagram
  participant User
  participant NextClient
  participant ExpressAPI
  participant MongoDB

  User->>NextClient: Thêm sản phẩm vào giỏ hàng
  User->>NextClient: Nhập thông tin nhận hàng
  NextClient->>ExpressAPI: POST /api/orders + Bearer token
  ExpressAPI->>ExpressAPI: verifyToken + validate items/address
  ExpressAPI->>MongoDB: Tạo Order với user id
  MongoDB-->>ExpressAPI: Order created
  ExpressAPI-->>NextClient: Order data
  NextClient-->>User: Hiển thị đơn hàng trong Profile
```

## 4. Luồng admin dashboard

```mermaid
sequenceDiagram
  participant Admin
  participant NextClient
  participant ExpressAPI
  participant MongoDB

  Admin->>NextClient: Mở /admin hoặc /reports
  NextClient->>ExpressAPI: GET /api/stats + Bearer token
  ExpressAPI->>ExpressAPI: verifyToken + verifyAdmin
  ExpressAPI->>MongoDB: Query users/products/orders
  MongoDB-->>ExpressAPI: Data tổng hợp
  ExpressAPI-->>NextClient: Stats JSON
  NextClient-->>Admin: Hiển thị doanh thu, đơn hàng, sản phẩm bán chạy
```

## 5. Phân quyền

```mermaid
flowchart TD
  R[Request API] --> T{Có JWT token?}
  T -- Không --> E401[401 No token]
  T -- Có --> V[verifyToken]
  V --> A{Route admin?}
  A -- Không --> OK[Cho phép user/admin]
  A -- Có --> IA{isAdmin = true?}
  IA -- Không --> E403[403 Admin only]
  IA -- Có --> AOK[Cho phép admin]
```

## 6. Ghi chú triển khai

- Frontend dùng Next.js App Router.
- Backend tách riêng bằng Express.js.
- Database dùng MongoDB local, import dữ liệu bằng `npm run seed`.
- Upload ảnh lưu tại `server/uploads` và public qua `/uploads/...`.
- Admin-only API gồm: products create/update/delete, users CRUD, orders list/update, stats, upload.
