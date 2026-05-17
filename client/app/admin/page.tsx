"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, authHeaders, imageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Order, Product, User } from "@/types";

type Tab = "dashboard" | "products" | "orders" | "users";
type ProductForm = { name: string; image: string; price: string | number; description: string; category: string };
type Stats = {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  totalUsers: number;
  averageOrderValue: number;
  ordersByDate: { date: string; count: number; revenue: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};

const emptyProduct: ProductForm = { name: "", image: "", price: "", description: "", category: "shirt" };
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

function orderItems(order: Order) {
  if (!order.items?.length) return "Không có sản phẩm";
  return order.items.map((item) => `${item.name} x${item.qty || 1}`).join(", ");
}

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/login");
  }, [loading, isAdmin, router]);

  async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "API error");
    return data;
  }

  async function loadAll() {
    try {
      const [p, o, u, s] = await Promise.all([
        request("/api/products?limit=100"),
        request("/api/orders"),
        request("/api/users"),
        request("/api/stats"),
      ]);
      setProducts(p.items || p);
      setOrders(o);
      setUsers(u);
      setStats(s);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const body = JSON.stringify({ ...form, price: Number(form.price) });
      if (editing) await request(`/api/products/${editing}`, { method: "PUT", body });
      else await request("/api/products", { method: "POST", body });
      setForm(emptyProduct);
      setEditing(null);
      setMessage("Đã lưu sản phẩm");
      loadAll();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function editProduct(p: Product) {
    setEditing(p._id);
    setForm({ name: p.name, image: p.image, price: p.price, description: p.description || "", category: p.category || "shirt" });
  }

  async function deleteProduct(id: string) {
    if (!confirm("Xóa sản phẩm?")) return;
    await request(`/api/products/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function uploadImage(file: File) {
    setError("");
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${API_URL}/api/upload/image`, { method: "POST", headers: { ...authHeaders() }, body: fd });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Upload lỗi");
      return;
    }
    setForm((f) => ({ ...f, image: data.url }));
  }

  async function updateOrder(id: string, status: string) {
    await request(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    loadAll();
  }

  async function deleteUser(id: string) {
    if (!confirm("Xóa user?")) return;
    await request(`/api/users/${id}`, { method: "DELETE" });
    loadAll();
  }

  if (loading || !isAdmin) return <main className="section"><div className="container">Đang kiểm tra quyền admin...</div></main>;

  return (
    <main className="light section">
      <div className="container">
        <h1>Admin Dashboard</h1>
        {message && <div className="notice">{message}</div>}
        {error && <div className="error">{error}</div>}

        <div className="admin-tabs">
          {[["dashboard", "Báo cáo"], ["products", "Sản phẩm"], ["orders", "Đơn hàng"], ["users", "Người dùng"]].map(([key, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key as Tab)}>{label}</button>
          ))}
        </div>

        {tab === "dashboard" && stats && (
          <section>
            <div className="grid stats-grid">
              <div className="card admin-stat-card"><h3>Tổng doanh thu</h3><p className="price">{money(stats.totalRevenue)}</p><small>Không tính đơn đã hủy</small></div>
              <div className="card admin-stat-card"><h3>Doanh thu hôm nay</h3><p className="price">{money(stats.todayRevenue)}</p><small>Cập nhật từ đơn hàng</small></div>
              <div className="card admin-stat-card"><h3>Đơn hàng</h3><p className="price">{stats.totalOrders}</p><small>{stats.pendingOrders} đơn chờ xác nhận</small></div>
              <div className="card admin-stat-card"><h3>Giá trị TB/đơn</h3><p className="price">{money(stats.averageOrderValue)}</p><small>Trừ đơn đã hủy</small></div>
              <div className="card admin-stat-card"><h3>Sản phẩm</h3><p className="price">{stats.totalProducts}</p><small>Đang bán</small></div>
              <div className="card admin-stat-card"><h3>Người dùng</h3><p className="price">{stats.totalUsers}</p><small>Tài khoản</small></div>
            </div>

            <h2>Trạng thái đơn</h2>
            <div className="grid status-grid">
              <div className="mini-stat">Chờ xác nhận <b>{stats.pendingOrders}</b></div>
              <div className="mini-stat">Đang xử lý <b>{stats.processingOrders}</b></div>
              <div className="mini-stat">Đang giao <b>{stats.shippingOrders}</b></div>
              <div className="mini-stat">Hoàn thành <b>{stats.completedOrders}</b></div>
              <div className="mini-stat">Đã hủy <b>{stats.cancelledOrders}</b></div>
            </div>

            <h2>Doanh thu theo ngày</h2>
            <table className="table"><thead><tr><th>Ngày</th><th>Số đơn</th><th>Doanh thu</th></tr></thead><tbody>{stats.ordersByDate.map((row) => <tr key={row.date}><td>{row.date}</td><td>{row.count}</td><td>{money(row.revenue)}</td></tr>)}</tbody></table>

            <h2>Sản phẩm bán nhiều</h2>
            <table className="table"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Doanh thu</th></tr></thead><tbody>{stats.topProducts.length ? stats.topProducts.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.qty}</td><td>{money(item.revenue)}</td></tr>) : <tr><td colSpan={3}>Chưa có dữ liệu</td></tr>}</tbody></table>
          </section>
        )}

        {tab === "products" && (
          <section>
            <form className="card" style={{ background: "#fff", color: "#111827", marginBottom: 24 }} onSubmit={saveProduct}>
              <h2>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                <input className="input" placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="input" type="number" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="shirt">Áo</option><option value="pants">Quần</option><option value="hoodie">Hoodie</option><option value="shoes">Giày</option>
                </select>
                <input className="input" placeholder="Link ảnh hoặc /uploads/..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <input className="input" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </div>
              <br />
              <textarea className="input" placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <br /><br />
              {form.image && <img src={imageUrl(String(form.image))} alt="preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 14 }} />}
              <br /><br />
              <button className="btn">{editing ? "Cập nhật" : "Thêm mới"}</button>
              {editing && <button type="button" className="btn ghost" onClick={() => { setEditing(null); setForm(emptyProduct); }}>Hủy</button>}
            </form>
            <table className="table"><thead><tr><th>Ảnh</th><th>Tên</th><th>Giá</th><th>Danh mục</th><th>Hành động</th></tr></thead><tbody>{products.map((p) => <tr key={p._id}><td><img src={imageUrl(p.image)} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }} alt={p.name} /></td><td>{p.name}</td><td>{money(p.price)}</td><td>{p.category}</td><td><button className="btn ghost" onClick={() => editProduct(p)}>Sửa</button> <button className="btn danger" onClick={() => deleteProduct(p._id)}>Xóa</button></td></tr>)}</tbody></table>
          </section>
        )}

        {tab === "orders" && (
          <section>
            <table className="table">
              <thead><tr><th>Mã đơn</th><th>Khách</th><th>SĐT</th><th>Sản phẩm đã mua</th><th>Tổng</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead>
              <tbody>{orders.map((o) => <tr key={o._id}><td>#{o._id.slice(-6).toUpperCase()}</td><td>{o.customerName}<br /><small>{o.address}</small></td><td>{o.phone}</td><td>{orderItems(o)}</td><td>{money(o.totalPrice)}</td><td><span className="status-pill">{statusLabel[o.status] || o.status}</span></td><td><select value={o.status} onChange={(e) => updateOrder(o._id, e.target.value)}><option value="Pending">Chờ xác nhận</option><option value="Processing">Đang xử lý</option><option value="Shipping">Đang giao</option><option value="Completed">Hoàn thành</option><option value="Cancelled">Đã hủy</option></select></td></tr>)}</tbody>
            </table>
          </section>
        )}

        {tab === "users" && (
          <section><table className="table"><thead><tr><th>Tên</th><th>Email</th><th>Quyền</th><th>Hành động</th></tr></thead><tbody>{users.map((u) => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.isAdmin ? "Admin" : "User"}</td><td><button className="btn danger" onClick={() => deleteUser(u._id)}>Xóa</button></td></tr>)}</tbody></table></section>
        )}
      </div>
    </main>
  );
}
