# Sprint 5 - Dashboard, SSR/SSG/ISR, SEO, Tối ưu

## Mục tiêu

Hoàn thiện dashboard báo cáo cho admin, áp dụng các kỹ thuật render của Next.js, SEO metadata và tối ưu cơ bản.

## Phạm vi công việc

### Dashboard/Báo cáo

- Tổng doanh thu.
- Doanh thu hôm nay.
- Tổng đơn hàng.
- Đơn theo trạng thái: Pending, Processing, Shipping, Completed, Cancelled.
- Tổng sản phẩm.
- Tổng user.
- Giá trị trung bình mỗi đơn.
- Doanh thu theo ngày.
- Top sản phẩm bán chạy.
- Đơn hàng gần nhất.

### SSR/SSG/ISR

Project dùng Next.js App Router nên có thể áp dụng render strategy theo từng page:

| Page | Strategy | Ghi chú |
|---|---|---|
| `/` | Static/SSG | Trang home ít thay đổi |
| `/products` | Server render + fetch API | Danh sách sản phẩm có query search/filter |
| `/products/[id]` | ISR phù hợp | Chi tiết sản phẩm có thể cache/revalidate |
| `/cart` | Client state | Dữ liệu giỏ hàng nằm ở browser |
| `/profile` | Client/Auth fetch | Dữ liệu theo user đăng nhập |
| `/admin` | Protected client fetch | Chỉ admin truy cập |

### SEO

- Metadata title/description trong layout/page.
- Friendly URL cho products và product detail.
- Cấu trúc route rõ ràng bằng App Router.

### Tối ưu

- Tách API URL vào env.
- Tách logic auth header.
- Admin-only route/API được bảo vệ.
- Ảnh upload dùng path `/uploads` từ server.

## API liên quan

- `GET /api/stats`
- `GET /api/orders`
- `GET /api/products`
- `GET /api/users`

## Deliverables

- `server/routes/statsRoutes.js`
- `client/app/admin/page.tsx`
- `client/app/reports/page.tsx`
- Metadata trong `client/app/layout.tsx`

## Kết quả

- Admin có dashboard chi tiết hơn.
- User thường không xem được báo cáo.
- Báo cáo lấy dữ liệu thật từ orders/products/users trong MongoDB.
- Trang home đã bỏ nút báo cáo để tránh user thường truy cập nhầm.

## Kiểm thử đã thực hiện

- Admin vào dashboard thành công.
- User thường không thấy menu báo cáo.
- User thường gọi `/api/stats` bị chặn 403.
- Dashboard hiển thị đúng sản phẩm đã mua trong đơn.

## Trạng thái

Hoàn thành.
