# Sprint 2 - Auth, Protected Routes, Profile

## Mục tiêu

Hoàn thiện đăng ký, đăng nhập, đăng xuất, phân quyền user/admin và trang profile cho khách hàng.

## Phạm vi công việc

- API đăng ký tài khoản.
- API đăng nhập bằng email/password.
- Hash password bằng bcrypt.
- Tạo JWT token sau khi login.
- Middleware `verifyToken` để bảo vệ API.
- Middleware `verifyAdmin` để bảo vệ API admin.
- Frontend lưu token/user vào localStorage.
- Tạo AuthContext/useAuth cho trạng thái đăng nhập.
- Tạo profile page để user xem thông tin và đơn hàng của mình.
- Ẩn/hiện menu theo role.

## API liên quan

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/orders/my`

## Deliverables

- `server/routes/authRoutes.js`
- `server/middleware/auth.js`
- `client/context/AuthContext.tsx`
- `client/hooks/useAuth.ts`
- `client/app/login/page.tsx`
- `client/app/register/page.tsx`
- `client/app/profile/page.tsx`

## Kết quả

- User có thể đăng ký, đăng nhập, đăng xuất.
- Admin/user được phân quyền bằng field `isAdmin`.
- User thường xem được đơn hàng đã đặt.
- User thường không truy cập được API admin.

## Kiểm thử đã thực hiện

- Login bằng tài khoản admin.
- Login bằng tài khoản user.
- Kiểm tra route profile.
- Kiểm tra API admin trả 403 khi user thường gọi.

## Trạng thái

Hoàn thành.
