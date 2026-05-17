import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import type { ProductResponse } from "@/types";

export const metadata = { title: "Trang chủ", description: "FashionShop - thời trang hiện đại cho bạn" };

export default async function HomePage(){
  const data = await apiFetch<ProductResponse>("/api/products?limit=4").catch(() => ({items:[],total:0,page:1,pages:1}));
  return <main><section className="hero"><div className="container"><p style={{color:"#ec4899",fontWeight:800}}>NEW COLLECTION 2026</p><h1>Thời Trang Hiện Đại Cho Bạn</h1><p>Khám phá xu hướng mới nhất với hàng trăm mẫu áo quần phong cách dành cho nam và nữ.</p><div className="row" style={{justifyContent:"center",marginTop:28}}><Link className="btn" href="/products">Mua ngay</Link></div></div></section><section className="section light"><div className="container"><h2>Sản phẩm mới</h2><div className="grid products">{data.items.map(p=><ProductCard key={p._id} product={p}/>)}</div></div></section></main>
}
