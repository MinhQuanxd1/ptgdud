# FashionShop - Next.js + Express + MongoDB Local

Project bán quần áo đã được chuẩn hóa để public GitHub và người khác clone về chạy với MongoDB local qua MongoDB Compass/Community Server.

## 1. Yêu cầu cài đặt

- Node.js
- MongoDB Community Server hoặc MongoDB Compass có kết nối local
- npm

MongoDB local mặc định:

```txt
mongodb://127.0.0.1:27017
```

Database dùng trong project:

```txt
shopdb
```

## 2. Cấu trúc project

```txt
client/               Next.js App Router + TypeScript
server/               Express API + MongoDB/Mongoose
server/seed/          Dữ liệu mẫu export từ MongoDB Compass
server/seed.js        Script import dữ liệu mẫu vào MongoDB local
```

## 3. Tạo file môi trường

### Server

Vào thư mục `server`, copy file mẫu:

```bash
copy .env.example .env
```

Nếu dùng Mac/Linux:

```bash
cp .env.example .env
```

Nội dung mặc định:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopdb
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

### Client

Vào thư mục `client`, copy file mẫu:

```bash
copy .env.example .env.local
```

Mac/Linux:

```bash
cp .env.example .env.local
```

Nội dung mặc định:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 4. Import dữ liệu mẫu vào MongoDB local

Bật MongoDB local trước. Sau đó chạy:

```bash
cd server
npm install
npm run seed
```

Lệnh này sẽ import:

- users
- products
- orders

vào database `shopdb`.

## 5. Chạy server

```bash
cd server
npm run dev
```

Server chạy tại:

```txt
http://localhost:5000
```

## 6. Chạy client

Mở terminal khác:

```bash
cd client
npm install
npm run dev
```

Client chạy tại:

```txt
http://localhost:3000
```

## 7. Tài khoản demo sau khi seed

```txt
Admin:
admin@test.com / 123456

User:
user@test.com / 123456
```

Bạn cũng có thể đăng ký user mới trên giao diện để test mua hàng. Nếu muốn cấp quyền admin cho user khác, vào MongoDB Compass sửa field:

```js
isAdmin: true
```

## 8. Lệnh nhanh

Terminal 1:

```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```

Terminal 2:

```bash
cd client
copy .env.example .env.local
npm install
npm run dev
```

## 9. Lưu ý khi public GitHub

Không đẩy file `.env` hoặc `.env.local` thật lên GitHub. Project đã có `.gitignore` để ẩn các file này.

Nên đẩy lên GitHub các file:

- `.env.example`
- `server/seed/*.json`
- `server/seed.js`
- `README.md`
