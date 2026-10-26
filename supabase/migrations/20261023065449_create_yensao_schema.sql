/*
# Yến Sào E-Commerce Schema

## Overview
Creates the database schema for a bird's nest (Yến Sào) e-commerce website.
This is a single-tenant store with no user authentication — visitors browse products,
add to cart, and place orders with customer info (name, phone, address).

## New Tables

### categories
- id (uuid, PK)
- name (text) — category name in Vietnamese
- slug (text, unique) — URL-friendly identifier
- description (text) — category description
- display_order (int) — sorting order
- created_at (timestamptz)

### products
- id (uuid, PK)
- name (text) — product name
- slug (text, unique) — URL-friendly identifier
- description (text) — detailed product description
- short_description (text) — brief description for cards
- price (bigint) — price in VND (stored as integer to avoid floating point issues)
- compare_price (bigint) — original/strike-through price for showing discounts
- weight (text) — weight info e.g. "100g", "500g"
- category_id (uuid, FK to categories)
- image_url (text) — primary product image
- stock (int) — available quantity
- is_featured (boolean) — show on homepage
- is_bestseller (boolean) — mark as bestseller
- display_order (int) — sorting order
- created_at (timestamptz)

### orders
- id (uuid, PK)
- order_number (text, unique) — human-readable order number
- customer_name (text)
- customer_phone (text)
- customer_email (text, nullable)
- shipping_address (text)
- city (text)
- note (text, nullable)
- total_amount (bigint) — total in VND
- status (text) — 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
- created_at (timestamptz)

### order_items
- id (uuid, PK)
- order_id (uuid, FK to orders, ON DELETE CASCADE)
- product_id (uuid, FK to products)
- product_name (text) — snapshot of product name at time of order
- price (bigint) — snapshot of price at time of order
- quantity (int) — quantity ordered

## Security
- RLS enabled on all tables.
- Products and categories: public read (anon + authenticated), no writes from frontend.
- Orders and order_items: public read+insert (anon can place orders), no update/delete from frontend.
- service_role granted full access for potential edge function use.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  price bigint NOT NULL DEFAULT 0,
  compare_price bigint,
  weight text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  stock int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  shipping_address text NOT NULL,
  city text NOT NULL,
  note text,
  total_amount bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  price bigint NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Grants: public read for catalog, anon can place orders
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;

GRANT SELECT, INSERT ON orders TO anon, authenticated;
GRANT SELECT, INSERT ON order_items TO anon, authenticated;

-- service_role full access
GRANT ALL ON categories, products, orders, order_items TO service_role;

-- Policies: categories (public read)
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Policies: products (public read)
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Policies: orders (anon can insert, can read own by order_number — but since no auth, allow read for order confirmation)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- Policies: order_items (anon can insert, can read)
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_order_items" ON order_items;
CREATE POLICY "anon_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
