export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  image_url?: string | null;
}

export type FlashSaleTimeSlot = { start: string; end: string; promotion_type: 'percent' | 'amount'; promotion_value: number };

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  quick_info?: { label: string; value: string }[];
  detail_content?: { type: 'text' | 'image'; content: string }[];
  gallery_images?: string[];
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
  flash_sale_daily_start_time?: string | null;
  flash_sale_daily_end_time?: string | null;
  flash_sale_daily_time_slots?: Array<string | FlashSaleTimeSlot> | null;
  flash_sale_price?: number | null;
  flash_sale_compare_price?: number | null;
  active_promotion_name?: string | null;
  active_promotion_campaign_type?: 'regular' | 'special' | null;
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
  | { name: 'products'; categorySlug?: string; searchQuery?: string }
  | { name: 'product'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'order-success'; orderNumber: string }
  | { name: 'about' }
  | { name: 'contact' };

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
