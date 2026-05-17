import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { apiFetch } from "@/lib/api";
import type { ProductResponse } from "@/types";

export const revalidate = 60; // ISR: trang danh sách sản phẩm cập nhật lại sau 60s
export const metadata = { title: "Sản phẩm", description: "Danh sách sản phẩm thời trang" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string,string>> }){
  const sp = await searchParams;
  const q = new URLSearchParams({ page: sp.page || "1", limit: "8" });
  if(sp.keyword) q.set("keyword", sp.keyword); if(sp.category) q.set("category", sp.category); if(sp.maxPrice) q.set("maxPrice", sp.maxPrice);
  const data = await apiFetch<ProductResponse>(`/api/products?${q.toString()}`).catch(()=>({items:[],total:0,page:1,pages:1}));
  return <main className="light section"><div className="container"><h1>Products</h1><ProductFilters />{data.items.length===0 ? <div className="notice">Không tìm thấy sản phẩm phù hợp.</div> : <div className="grid products">{data.items.map(p=><ProductCard key={p._id} product={p}/>)}</div>}<div className="row" style={{justifyContent:"center",marginTop:30}}>{Array.from({length:data.pages},(_,i)=>i+1).map(n=><Link key={n} className={n===data.page?"btn":"btn ghost"} href={`/products?${new URLSearchParams({...sp,page:String(n)}).toString()}`}>{n}</Link>)}</div></div></main>
}
