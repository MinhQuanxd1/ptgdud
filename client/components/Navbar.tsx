"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth(); const { totalQty } = useCart();
  return <nav className="nav"><div className="container nav-inner"><Link href="/" className="logo">FashionShop</Link><div className="menu"><Link href="/">Home</Link><Link href="/products">Products</Link><Link href="/cart">Cart ({totalQty})</Link>{isAdmin && <Link href="/admin">Admin</Link>}{user ? <><Link href="/profile"><span className="badge">{user.isAdmin ? "Admin" : "Đơn hàng"}</span></Link><button className="btn" onClick={logout}>Logout</button></> : <><Link href="/login">Login</Link><Link href="/register" className="btn">Register</Link></>}</div></div></nav>;
}
