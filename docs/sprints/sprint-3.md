# Sprint 3 - CRUD Module 1-2 + Upload

## Mục tiêu

Hoàn thiện CRUD sản phẩm và đơn hàng, đồng thời bổ sung upload ảnh sản phẩm cho admin.

## Phạm vi công việc

### Module Products

- Xem danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Admin thêm sản phẩm.
- Admin sửa sản phẩm.
- Admin xóa sản phẩm.

### Module Orders

- User tạo đơn hàng từ giỏ hàng.
- User xem đơn đã đặt.
- Admin xem toàn bộ đơn hàng.
- Admin cập nhật trạng thái đơn.

### Upload

- Upload ảnh sản phẩm bằng Multer.
- Kiểm tra định dạng file `image/*`.
- Giới hạn dung lượng 2MB.
- Lưu ảnh tại `server/uploads`.
- Trả về URL ảnh để gắn vào sản phẩm.

## API liên quan

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id`
- `POST /api/upload/image`

## Deliverables

- `server/routes/productRoutes.js`
- `server/routes/orderRoutes.js`
- `server/routes/uploadRoutes.js`
- `client/app/admin/page.tsx`
- `client/app/cart/page.tsx`
- `client/app/products/[id]/page.tsx`

## Kết quả

- Admin quản lý được sản phẩm.
- Khách hàng đặt hàng được.
- Admin quản lý trạng thái đơn hàng được.
- Ảnh sản phẩm có thể upload từ giao diện admin.

## Kiểm thử đã thực hiện

- Tạo sản phẩm mới.
- Sửa sản phẩm.
- Xóa sản phẩm.
- Upload ảnh hợp lệ.
- Tạo đơn hàng từ user.
- Admin cập nhật trạng thái đơn.

## Trạng thái

Hoàn thành.
