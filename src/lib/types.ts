export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  image_url?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  weight: string | null;
  category_id: string | null;
  image_url: string | null;
  stock: number;
  sold_count?: number;
  is_featured: boolean;
  is_bestseller: boolean;
  display_order: number;
  is_published?: boolean;
  is_flash_sale?: boolean;
  flash_sale_start_at?: string | null;
  flash_sale_end_at?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemInput {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface OrderInput {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  note: string | null;
  total_amount: number;
  status: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  note: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

export type Page =
  | { name: 'home' }
  | { name: 'products'; categorySlug?: string }
  | { name: 'product'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'order-success'; orderNumber: string }
  | { name: 'about' }
  | { name: 'contact' };

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
