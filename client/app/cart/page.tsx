"use client";

import Link from "next/link";
import { useState } from "react";
import { API_URL, authHeaders, imageUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { cart, totalPrice, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function checkout() {
    setMsg("");
    setError("");

    if (!user) {
      setError("Bạn cần đăng nhập trước khi đặt hàng");
      return;
    }

    if (!cart.length) {
      setError("Giỏ hàng trống");
      return;
    }

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ ...form, items: cart, totalPrice }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setMsg("Đặt hàng thành công. Bạn có thể xem đơn trong trang tài khoản.");
      clearCart();
      setForm({ customerName: "", phone: "", address: "" });
    } else {
      setError(data.message || "Lỗi đặt hàng");
    }
  }

  return (
    <main className="section">
      <div className="container">
        <h1>Giỏ hàng</h1>
        {msg && <div className="notice">{msg} <Link href="/profile"><b>Xem đơn hàng</b></Link></div>}
        {error && <div className="error">{error}</div>}

        {!cart.length ? (
          <p>Giỏ hàng trống</p>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="card row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
              <div className="row">
                <img src={imageUrl(item.image)} alt={item.name} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 14 }} />
                <div>
                  <h3>{item.name}</h3>
                  <p className="price">{item.price.toLocaleString("vi-VN")}đ</p>
                  <div className="row">
                    <button className="btn ghost" onClick={() => decreaseQty(item._id)}>-</button>
                    <b>{item.qty}</b>
                    <button className="btn ghost" onClick={() => increaseQty(item._id)}>+</button>
                  </div>
                </div>
              </div>
              <div>
                <b>{(item.price * item.qty).toLocaleString("vi-VN")}đ</b><br />
                <button className="btn danger" onClick={() => removeFromCart(item._id)}>Xóa</button>
              </div>
            </div>
          ))
        )}

        <h2>Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ</h2>
        <div className="card" style={{ maxWidth: 560 }}>
          <h2>Thông tin nhận hàng</h2>
          {!user && <div className="error">Vui lòng đăng nhập để đặt hàng.</div>}
          <input className="input dark-input" placeholder="Họ tên" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <br /><br />
          <input className="input dark-input" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <br /><br />
          <textarea className="input dark-input" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <br /><br />
          <button className="btn" onClick={checkout}>Đặt hàng</button>
        </div>
      </div>
    </main>
  );
}
