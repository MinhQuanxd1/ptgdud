"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
export default function LoginPage(){const router=useRouter();const {login}=useAuth();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");async function submit(e:React.FormEvent){e.preventDefault();setError("");try{await login(email,password);router.push("/")}catch(err:any){setError(err.message)}}return <main className="section"><div className="container" style={{maxWidth:480}}><form className="card" onSubmit={submit}><h1>Đăng nhập</h1>{error&&<div className="error">{error}</div>}<input className="input dark-input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><br/><br/><input className="input dark-input" type="password" placeholder="Mật khẩu" value={password} onChange={e=>setPassword(e.target.value)} required/><br/><br/><button className="btn" style={{width:"100%"}}>Đăng nhập</button><p>Chưa có tài khoản? <Link href="/register" style={{color:"#ec4899"}}>Đăng ký</Link></p></form></div></main>}
