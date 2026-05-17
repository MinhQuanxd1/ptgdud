# Sprint 1 - Setup, UI Base, Routing, Design System, Mock Data

## Mục tiêu

Thiết lập nền tảng project bán quần áo, xây dựng giao diện cơ bản, routing chính và dữ liệu mẫu ban đầu.

## Phạm vi công việc

- Khởi tạo frontend Next.js App Router + TypeScript.
- Giữ backend Express.js + MongoDB/Mongoose.
- Tạo layout chung cho toàn app.
- Tạo navigation chính: Home, Products, Cart, Login, Register, Profile, Admin.
- Xây dựng design system đơn giản: button, card, input, table, grid, màu chủ đạo.
- Chuẩn hóa cấu trúc thư mục frontend/backend.
- Chuẩn bị dữ liệu seed cho users, products, orders.

## Deliverables

- `client/app/layout.tsx`
- `client/app/page.tsx`
- `client/app/products/page.tsx`
- `client/app/cart/page.tsx`
- `client/app/globals.css`
- `server/seed/*.json`
- `server/seed.js`

## Kết quả

- App có giao diện nền đầy đủ.
- Điều hướng giữa các trang hoạt động.
- Dữ liệu mẫu có thể import bằng `npm run seed`.
- Cấu trúc project rõ ràng để phát triển các sprint tiếp theo.

## Kiểm thử đã thực hiện

- Chạy server local.
- Chạy client local.
- Kiểm tra route Home, Products, Cart.
- Kiểm tra seed data vào MongoDB local.

## Trạng thái

Hoàn thành.
