"use client";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
export default function AddToCartButton({product}:{product:Product}){const {addToCart}=useCart();return <button className="btn" onClick={()=>addToCart(product)}>Thêm vào giỏ hàng</button>}
