"use client";
import Link from "next/link";
import { imageUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
export default function ProductCard({ product }: { product: Product }) { const { addToCart } = useCart(); return <div className="product-card"><Link href={`/products/${product._id}`}><img src={imageUrl(product.image)} alt={product.name}/></Link><div className="product-card-body"><Link href={`/products/${product._id}`}><h2>{product.name}</h2></Link><p style={{color:"#6b7280"}}>{product.category}</p><p className="price">{Number(product.price).toLocaleString("vi-VN")}đ</p><button className="btn" style={{width:"100%"}} onClick={() => addToCart(product)}>Add To Cart</button></div></div> }
