# Sprint 6 - Testing, Bugfix, Polish UI/UX, CI/CD, Hoàn thiện Docs

## Mục tiêu

Hoàn thiện sản phẩm trước khi nộp: sửa lỗi, kiểm tra flow chính, chuẩn hóa docs và chuẩn bị public GitHub.

## Phạm vi công việc

### Testing thủ công

Các flow đã kiểm tra:

1. User đăng ký tài khoản.
2. User đăng nhập.
3. User xem sản phẩm.
4. User thêm sản phẩm vào giỏ.
5. User đặt hàng.
6. User xem đơn đã đặt trong profile.
7. Admin đăng nhập.
8. Admin xem dashboard.
9. Admin thêm/sửa/xóa sản phẩm.
10. Admin upload ảnh sản phẩm.
11. Admin xem đơn hàng và sản phẩm trong đơn.
12. Admin cập nhật trạng thái đơn.
13. Admin xem/quản lý user.

### Bugfix

- Sửa lỗi login xong navbar không cập nhật trạng thái.
- Sửa quyền báo cáo: chỉ admin được xem.
- Bỏ nút “Xem báo cáo” ở trang home.
- Sửa user đặt hàng xong xem được đơn hàng của chính mình.
- Sửa đơn hàng hiển thị rõ sản phẩm đã mua, số lượng, giá, thành tiền.
- Bổ sung thống kê dashboard chi tiết hơn.

### Polish UI/UX

- Cải thiện admin dashboard.
- Bổ sung trạng thái đơn bằng tiếng Việt.
- Bảng đơn hàng hiển thị sản phẩm rõ hơn.
- Empty state cho dữ liệu chưa có.
- Loading/auth check cho trang cần quyền.

### CI/CD

Chưa cấu hình CI/CD tự động trong project hiện tại. Đề xuất nếu triển khai tiếp:

- GitHub Actions chạy lint/build.
- Deploy frontend lên Vercel.
- Deploy backend lên Render/Railway.
- Dùng MongoDB Atlas cho môi trường production/demo online.

### Docs

Đã hoàn thiện:

- ERD/schema data.
- API spec markdown.
- Diagram kiến trúc.
- Sprint report 1-6.
- README hướng dẫn chạy local.
- Seed data từ MongoDB Compass.

## Deliverables

- `docs/ERD_SCHEMA.md`
- `docs/API_SPEC.md`
- `docs/ARCHITECTURE_DIAGRAM.md`
- `docs/sprints/sprint-1.md`
- `docs/sprints/sprint-2.md`
- `docs/sprints/sprint-3.md`
- `docs/sprints/sprint-4.md`
- `docs/sprints/sprint-5.md`
- `docs/sprints/sprint-6.md`

## Kết quả

Project sẵn sàng để public GitHub và người khác clone về chạy local bằng MongoDB Compass/Community Server.

## Trạng thái

Hoàn thành.
