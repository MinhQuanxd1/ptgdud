"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = { user: User | null; token: string | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (data: { name: string; email: string; password: string }) => Promise<void>; logout: () => void; isAdmin: boolean };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token); setUser(data.user);
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); window.location.href = "/"; };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAdmin: !!user?.isAdmin }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
