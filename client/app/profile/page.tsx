"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, authHeaders, imageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types";

const statusLabel: Record<string, string> = {
  Pending: "Chờ xác nhận",
  Processing: "Đang xử lý",
  Shipping: "Đang giao",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
};

function money(value = 0) {
  return value.toLocaleString("vi-VN") + "đ";
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function loadMyOrders() {
      try {
        const res = await fetch(`${API_URL}/api/orders/my`, { headers: { ...authHeaders() } });
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error(data.message || "Không tải được đơn hàng");
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadMyOrders();
  }, [user]);

  if (loading || !user) {
    return <main className="section"><div className="container">Đang kiểm tra đăng nhập...</div></main>;
  }

  return (
    <main className="light section">
      <div className="container">
        <div className="card" style={{ background: "#fff", color: "#111827", maxWidth: 760, marginBottom: 24 }}>
          <h1>Tài khoản</h1>
          <p><b>Tên:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Vai trò:</b> {user.isAdmin ? "Admin" : "User"}</p>
        </div>

        <h2>Đơn hàng của tôi</h2>
        {error && <div className="error">{error}</div>}
        {!orders.length ? (
          <div className="notice">Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div className="card order-card" key={order._id}>
                <div className="order-header">
                  <div>
                    <h3>Đơn #{order._id.slice(-6).toUpperCase()}</h3>
                    <p>Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "-"}</p>
                    <p>Người nhận: {order.customerName} - {order.phone}</p>
                    <p>Địa chỉ: {order.address}</p>
                  </div>
                  <div>
                    <span className="status-pill">{statusLabel[order.status] || order.status}</span>
                    <p className="price">{money(order.totalPrice)}</p>
                  </div>
                </div>

                <table className="table compact-table">
                  <thead>
                    <tr><th>Sản phẩm đã mua</th><th>Giá</th><th>SL</th><th>Thành tiền</th></tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={`${item._id}-${index}`}>
                        <td>
                          <div className="row product-line">
                            {item.image && <img src={imageUrl(item.image)} alt={item.name} />}
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>{money(item.price)}</td>
                        <td>{item.qty || 1}</td>
                        <td>{money(item.price * (item.qty || 1))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
