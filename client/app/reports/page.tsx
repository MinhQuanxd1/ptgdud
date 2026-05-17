"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, authHeaders } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types";

type Stats = {
  totalRevenue: number;
  completedRevenue: number;
  cancelledRevenue: number;
  totalOrders: number;
  todayOrders: number;
  todayRevenue: number;
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
  latestOrders: Order[];
};

function money(value = 0) {
  return value.toLocaleString("vi-VN") + "đ";
}

function orderItems(order: Order) {
  if (!order.items?.length) return "Không có sản phẩm";
  return order.items.map((item) => `${item.name} x${item.qty || 1}`).join(", ");
}

export default function ReportsPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/login");
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/stats`, { headers: { ...authHeaders() } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Không tải được báo cáo");
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadStats();
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return <main className="section"><div className="container">Đang kiểm tra quyền admin...</div></main>;
  }

  return (
    <main className="light section">
      <div className="container">
        <h1>Báo cáo bán hàng</h1>
        {error && <div className="error">{error}</div>}
        {!stats ? (
          <div className="notice">Đang tải báo cáo...</div>
        ) : (
          <>
            <div className="grid stats-grid">
              <div className="card admin-stat-card"><h3>Tổng doanh thu</h3><p className="price">{money(stats.totalRevenue)}</p><small>Không tính đơn đã hủy</small></div>
              <div className="card admin-stat-card"><h3>Doanh thu hôm nay</h3><p className="price">{money(stats.todayRevenue)}</p><small>{stats.todayOrders} đơn hôm nay</small></div>
              <div className="card admin-stat-card"><h3>Tổng đơn hàng</h3><p className="price">{stats.totalOrders}</p><small>{stats.pendingOrders} đơn chờ xác nhận</small></div>
              <div className="card admin-stat-card"><h3>Giá trị TB/đơn</h3><p className="price">{money(stats.averageOrderValue)}</p><small>Trừ đơn đã hủy</small></div>
              <div className="card admin-stat-card"><h3>Sản phẩm</h3><p className="price">{stats.totalProducts}</p><small>Đang có trong shop</small></div>
              <div className="card admin-stat-card"><h3>Người dùng</h3><p className="price">{stats.totalUsers}</p><small>Tài khoản đã đăng ký</small></div>
            </div>

            <h2>Trạng thái đơn hàng</h2>
            <div className="grid status-grid">
              <div className="mini-stat">Chờ xác nhận <b>{stats.pendingOrders}</b></div>
              <div className="mini-stat">Đang xử lý <b>{stats.processingOrders}</b></div>
              <div className="mini-stat">Đang giao <b>{stats.shippingOrders}</b></div>
              <div className="mini-stat">Hoàn thành <b>{stats.completedOrders}</b></div>
              <div className="mini-stat">Đã hủy <b>{stats.cancelledOrders}</b></div>
            </div>

            <h2>Đơn hàng theo ngày</h2>
            <table className="table">
              <thead><tr><th>Ngày</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
              <tbody>{stats.ordersByDate.map((row) => <tr key={row.date}><td>{row.date}</td><td>{row.count}</td><td>{money(row.revenue)}</td></tr>)}</tbody>
            </table>

            <h2>Sản phẩm bán nhiều</h2>
            <table className="table">
              <thead><tr><th>Sản phẩm</th><th>Số lượng bán</th><th>Doanh thu</th></tr></thead>
              <tbody>{stats.topProducts.length ? stats.topProducts.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.qty}</td><td>{money(item.revenue)}</td></tr>) : <tr><td colSpan={3}>Chưa có dữ liệu bán hàng</td></tr>}</tbody>
            </table>

            <h2>Đơn hàng gần đây</h2>
            <table className="table">
              <thead><tr><th>Mã đơn</th><th>Khách</th><th>Sản phẩm đã mua</th><th>Tổng</th><th>Trạng thái</th></tr></thead>
              <tbody>{stats.latestOrders.map((order) => <tr key={order._id}><td>#{order._id.slice(-6).toUpperCase()}</td><td>{order.customerName}</td><td>{orderItems(order)}</td><td>{money(order.totalPrice)}</td><td><span className="status-pill">{order.status}</span></td></tr>)}</tbody>
            </table>
          </>
        )}
      </div>
    </main>
  );
}
