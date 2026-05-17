import type { Metadata } from "next";
import { apiFetch, imageUrl } from "@/lib/api";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic"; // SSR: luôn lấy dữ liệu mới khi request detail

export async function generateMetadata({ params }: { params: Promise<{id:string}> }): Promise<Metadata> { const {id}=await params; const p=await apiFetch<Product>(`/api/products/${id}`).catch(()=>null); return { title: p?.name || "Chi tiết sản phẩm", description: p?.description || "Chi tiết sản phẩm FashionShop" }; }
export default async function ProductDetail({ params }: { params: Promise<{id:string}> }){ const {id}=await params; const p=await apiFetch<Product>(`/api/products/${id}`, { cache: "no-store" }); return <main className="light section"><div className="container"><div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",alignItems:"start"}}><img src={imageUrl(p.image)} alt={p.name} style={{width:"100%",borderRadius:24,maxHeight:620,objectFit:"cover"}}/><div className="card" style={{background:"#fff",color:"#111827"}}><span className="badge">{p.category}</span><h1>{p.name}</h1><p className="price">{Number(p.price).toLocaleString("vi-VN")}đ</p><p style={{color:"#4b5563",lineHeight:1.7}}>{p.description || "Sản phẩm thời trang hiện đại, dễ phối đồ."}</p><AddToCartButton product={p}/></div></div></div></main> }
