export type Product = { _id: string; name: string; image: string; price: number; description?: string; category?: string; createdAt?: string };
export type User = { _id: string; name: string; email: string; isAdmin: boolean; createdAt?: string };
export type CartItem = Product & { qty: number };
export type Order = { _id: string; customerName: string; phone: string; address: string; items: CartItem[]; totalPrice: number; status: string; createdAt?: string };
export type ProductResponse = { items: Product[]; total: number; page: number; pages: number };
