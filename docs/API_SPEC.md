# API Specification

Base URL local:

```txt
http://localhost:5000
```

Header xác thực cho các route cần đăng nhập:

```http
Authorization: Bearer <JWT_TOKEN>
```

Format lỗi chung:

```json
{
  "message": "Nội dung lỗi"
}
```

## 1. Health Check

### GET `/api/health`

Kiểm tra server có chạy không.

Response 200:

```json
{
  "ok": true,
  "message": "Server is running"
}
```

---

## 2. Auth API

### POST `/api/auth/register`

Đăng ký tài khoản user.

Body:

```json
{
  "name": "Nguyen Van A",
  "email": "user@test.com",
  "password": "123456"
}
```

Response 201:

```json
{
  "message": "Register success",
  "user": {
    "_id": "...",
    "name": "Nguyen Van A",
    "email": "user@test.com",
    "isAdmin": false
  }
}
```

### POST `/api/auth/login`

Đăng nhập.

Body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Response 200:

```json
{
  "token": "jwt_token",
  "user": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@test.com",
    "isAdmin": true
  }
}
```

### GET `/api/auth/me`

Lấy thông tin user hiện tại.

Role: user/admin.

Response 200:

```json
{
  "_id": "...",
  "name": "Admin",
  "email": "admin@test.com",
  "isAdmin": true
}
```

---

## 3. Product API

### GET `/api/products`

Lấy danh sách sản phẩm, có search/filter/pagination.

Query params:

| Param | Type | Mô tả |
|---|---|---|
| `page` | Number | Trang hiện tại |
| `limit` | Number | Số sản phẩm mỗi trang |
| `keyword` | String | Tìm theo tên sản phẩm |
| `category` | String | Lọc danh mục: `shirt`, `pants`, `hoodie`, `shoes`, `all` |
| `minPrice` | Number | Giá thấp nhất |
| `maxPrice` | Number | Giá cao nhất |

Ví dụ:

```http
GET /api/products?page=1&limit=8&keyword=áo&category=shirt&minPrice=10000&maxPrice=500000
```

Response 200:

```json
{
  "items": [
    {
      "_id": "...",
      "name": "Áo Nam basic",
      "image": "http://localhost:5000/uploads/ao1.jpg",
      "price": 20000,
      "description": "...",
      "category": "shirt"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

### GET `/api/products/:id`

Lấy chi tiết sản phẩm.

Response 200:

```json
{
  "_id": "...",
  "name": "Áo Nam basic",
  "image": "http://localhost:5000/uploads/ao1.jpg",
  "price": 20000,
  "description": "...",
  "category": "shirt"
}
```

### POST `/api/products`

Tạo sản phẩm mới.

Role: admin.

Body:

```json
{
  "name": "Áo sơ mi",
  "image": "/uploads/aosomi.jpg",
  "price": 500000,
  "description": "Áo sơ mi lịch sự",
  "category": "shirt"
}
```

### PUT `/api/products/:id`

Cập nhật sản phẩm.

Role: admin.

Body:

```json
{
  "name": "Áo sơ mi mới",
  "price": 450000
}
```

### DELETE `/api/products/:id`

Xóa sản phẩm.

Role: admin.

Response 200:

```json
{
  "message": "Deleted"
}
```

---

## 4. Order API

### POST `/api/orders`

Tạo đơn hàng.

Role: user/admin.

Body:

```json
{
  "customerName": "Nguyễn Minh Quân",
  "phone": "0379026510",
  "address": "Tây Ninh",
  "items": [
    {
      "_id": "6a096005df5d6bf6de075489",
      "name": "áo sơ mi",
      "image": "/uploads/aosomi.jpg",
      "price": 500000,
      "category": "shirt",
      "qty": 2
    }
  ],
  "totalPrice": 1000000
}
```

Response 201:

```json
{
  "_id": "...",
  "user": "...",
  "customerName": "Nguyễn Minh Quân",
  "phone": "0379026510",
  "address": "Tây Ninh",
  "items": [],
  "totalPrice": 1000000,
  "status": "Pending"
}
```

### GET `/api/orders/my`

Lấy đơn hàng của user đang đăng nhập.

Role: user/admin.

Response 200:

```json
[
  {
    "_id": "...",
    "customerName": "Nguyễn Minh Quân",
    "items": [
      {
        "name": "áo sơ mi",
        "price": 500000,
        "qty": 2
      }
    ],
    "totalPrice": 1000000,
    "status": "Processing"
  }
]
```

### GET `/api/orders`

Lấy tất cả đơn hàng.

Role: admin.

### PUT `/api/orders/:id`

Cập nhật trạng thái đơn hàng.

Role: admin.

Body:

```json
{
  "status": "Shipping"
}
```

---

## 5. User API

### GET `/api/users`

Lấy danh sách user.

Role: admin.

### POST `/api/users`

Tạo user từ admin.

Role: admin.

Body:

```json
{
  "name": "User Demo",
  "email": "demo@test.com",
  "password": "123456",
  "isAdmin": false
}
```

### PUT `/api/users/:id`

Cập nhật user.

Role: admin.

Body:

```json
{
  "name": "User Demo Updated",
  "email": "demo@test.com",
  "isAdmin": false
}
```

### DELETE `/api/users/:id`

Xóa user.

Role: admin.

---

## 6. Upload API

### POST `/api/upload/image`

Upload ảnh sản phẩm.

Role: admin.

Content-Type:

```txt
multipart/form-data
```

Field:

```txt
image
```

Giới hạn:

```txt
2MB, chỉ nhận file image/*
```

Response 200:

```json
{
  "url": "/uploads/1710000000000-image.jpg"
}
```

---

## 7. Stats API

### GET `/api/stats`

Lấy dữ liệu báo cáo dashboard.

Role: admin.

Response 200:

```json
{
  "totalRevenue": 3100000,
  "completedRevenue": 700000,
  "cancelledRevenue": 0,
  "totalOrders": 3,
  "todayOrders": 0,
  "todayRevenue": 0,
  "pendingOrders": 1,
  "processingOrders": 1,
  "shippingOrders": 1,
  "completedOrders": 1,
  "cancelledOrders": 0,
  "totalProducts": 5,
  "totalUsers": 4,
  "averageOrderValue": 1033333,
  "byStatus": {
    "Pending": 0,
    "Processing": 1,
    "Shipping": 1,
    "Completed": 1,
    "Cancelled": 0
  },
  "ordersByDate": [
    {
      "date": "2026-05-17",
      "count": 3,
      "revenue": 3100000
    }
  ],
  "topProducts": [
    {
      "name": "áo sơ mi",
      "qty": 5,
      "revenue": 2500000
    }
  ],
  "latestOrders": []
}
```
