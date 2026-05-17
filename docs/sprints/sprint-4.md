# Sprint 4 - CRUD Module 3 + Search/Filter/Pagination

## Mục tiêu

Bổ sung CRUD người dùng và hoàn thiện search/filter/pagination cho sản phẩm.

## Phạm vi công việc

### Module Users

- Admin xem danh sách user.
- Admin tạo user.
- Admin cập nhật user.
- Admin xóa user.
- Trả về public user, không trả password ra client ở các API chính.

### Search/Filter/Pagination

- Search sản phẩm theo keyword.
- Filter theo category.
- Filter theo minPrice/maxPrice.
- Pagination theo page/limit.
- Trả về tổng số sản phẩm và tổng số trang.

## API liên quan

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/products?page=&limit=&keyword=&category=&minPrice=&maxPrice=`

## Deliverables

- `server/routes/userRoutes.js`
- Cập nhật `server/routes/productRoutes.js`
- Cập nhật `client/app/products/page.tsx`
- Cập nhật `client/app/admin/page.tsx`

## Kết quả

- Đủ 3 module CRUD: Products, Orders, Users.
- Trang Products có search/filter/pagination.
- Admin có thể quản lý user.

## Kiểm thử đã thực hiện

- Tìm kiếm sản phẩm theo tên.
- Lọc sản phẩm theo danh mục.
- Lọc sản phẩm theo khoảng giá.
- Chuyển trang sản phẩm.
- Admin xóa user.

## Trạng thái

Hoàn thành.
