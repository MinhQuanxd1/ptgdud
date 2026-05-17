import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: { default: "FashionShop", template: "%s | FashionShop" },
  description: "App bán quần áo dùng Next.js frontend + Express/MongoDB cũ.",
  openGraph: { title: "FashionShop", description: "Thời trang hiện đại cho bạn", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body><AuthProvider><CartProvider><Navbar />{children}<Footer /></CartProvider></AuthProvider></body></html>;
}
