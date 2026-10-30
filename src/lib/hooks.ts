import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, Page } from '@/lib/types';

function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    display_order: row.display_order ?? 0,
    image_url: row.image_url ?? null,
  };
}

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    short_description: row.short_description ?? row.description ?? null,
    quick_info: Array.isArray(row.quick_info) ? row.quick_info : [],
    detail_content: Array.isArray(row.detail_content) ? row.detail_content : [],
    gallery_images: Array.isArray(row.gallery_urls)
      ? row.gallery_urls.filter((url: unknown): url is string => typeof url === 'string' && Boolean(url.trim()))
      : Array.isArray(row.gallery_images)
        ? row.gallery_images.filter((url: unknown): url is string => typeof url === 'string' && Boolean(url.trim()))
        : Array.isArray(row.images)
          ? row.images.filter((url: unknown): url is string => typeof url === 'string' && Boolean(url.trim()))
          : Array.isArray(row.image_urls)
            ? row.image_urls.filter((url: unknown): url is string => typeof url === 'string' && Boolean(url.trim()))
            : [],
    price: Number(row.price ?? 0),
    compare_price: row.compare_at_price == null
      ? (row.compare_price == null ? null : Number(row.compare_price))
      : Number(row.compare_at_price),
    weight: row.weight ?? null,
    category_id: row.category_id ?? null,
    image_url: row.image_url ?? null,
    stock: Number(row.stock ?? 0),
    sold_count: row.sold_count == null ? undefined : Number(row.sold_count),
    // These flags are not part of the current Admin CMS schema.
    is_featured: row.is_featured ?? false,
    is_bestseller: row.is_bestseller ?? false,
    display_order: row.display_order ?? 0,
    is_published: row.is_published ?? false,
    is_flash_sale: row.is_flash_sale ?? false,
    flash_sale_start_at: row.flash_sale_start_at ?? null,
    flash_sale_end_at: row.flash_sale_end_at ?? null,
  };
}


type PromotionRow = {
  id: string;
  promotion_type: 'percent' | 'amount';
  promotion_value: number;
  start_at: string;
  end_at: string;
  is_flash_deal: boolean;
  flash_start_at: string | null;
  flash_end_at: string | null;
  is_active: boolean;
};

async function attachPromotions(rows: any[]): Promise<Product[]> {
  const products = rows.map(mapProduct);
  if (!products.length) return products;

  const client = supabase;
  const [{ data: links, error: linksError }, { data: promotionRows, error: promotionsError }] = await Promise.all([
    client.from('promotion_products').select('product_id,promotion_id'),
    client.from('promotions').select('id,promotion_type,promotion_value,start_at,end_at,is_flash_deal,flash_start_at,flash_end_at,is_active'),
  ]);

  if (linksError || promotionsError) {
    console.error('Failed to load product promotions:', linksError?.message ?? promotionsError?.message);
    return products;
  }

  const promotions = (promotionRows ?? []) as PromotionRow[];
  const linked = new Map<string, PromotionRow[]>();
  for (const link of links ?? []) {
    const promotion = promotions.find((item) => item.id === link.promotion_id);
    if (!promotion || !promotion.is_active) continue;
    linked.set(link.product_id, [...(linked.get(link.product_id) ?? []), promotion]);
  }

  const now = Date.now();
  return products.map((product) => {
    const candidates = (linked.get(product.id) ?? []).sort((a, b) => {
      const aFlash = a.is_flash_deal ? 1 : 0;
      const bFlash = b.is_flash_deal ? 1 : 0;
      return bFlash - aFlash;
    });
    const flash = candidates.find((p) => p.is_flash_deal && p.flash_start_at && p.flash_end_at);
    const flashStart = flash?.flash_start_at ?? null;
    const flashEnd = flash?.flash_end_at ?? null;
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);
    const flashSaleVisibleToday = Boolean(
      flash && flashStart && flashEnd &&
      new Date(flashEnd).getTime() >= dayStart.getTime() &&
      new Date(flashStart).getTime() <= dayEnd.getTime()
    );

    const applicable = candidates.find((p) => {
      const campaignActive = new Date(p.start_at).getTime() <= now && new Date(p.end_at).getTime() >= now;
      if (!campaignActive) return false;
      if (!p.is_flash_deal) return true;
      return Boolean(p.flash_start_at && p.flash_end_at &&
        new Date(p.flash_start_at).getTime() <= now &&
        new Date(p.flash_end_at).getTime() >= now);
    });

    let effectivePrice = product.price;
    let comparePrice = product.compare_price;
    if (applicable) {
      const rawDiscount = applicable.promotion_type === 'percent'
        ? product.price * Number(applicable.promotion_value) / 100
        : Number(applicable.promotion_value);
      effectivePrice = Math.max(0, Math.round(product.price - rawDiscount));
      comparePrice = product.price;
    }

    return {
      ...product,
      price: effectivePrice,
      compare_price: comparePrice,
      is_flash_sale: flashSaleVisibleToday,
      flash_sale_start_at: flashStart,
      flash_sale_end_at: flashEnd,
    };
  });
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled) {
          if (error) console.error('Failed to load categories:', error.message);
          else setCategories((data ?? []).map(mapCategory));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}

export function useProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  bestseller?: boolean;
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    let query = supabase
      .from('products')
      .select('*, categories(slug)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (options?.categorySlug) {
      query = query.eq('categories.slug', options.categorySlug);
    }

    // The current CMS schema has no is_featured/is_bestseller columns.
    // Keep the options API compatible, but don't query nonexistent columns.
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    query.then(({ data, error }) => {
      if (!cancelled) {
        if (error) {
          console.error('Failed to load products:', error.message);
          setProducts([]);
        } else {
          void attachPromotions(data ?? []).then((items) => { if (!cancelled) setProducts(items); });
        }
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [options?.categorySlug, options?.featured, options?.bestseller, options?.limit]);

  return { products, loading };
}

export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setProduct(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Failed to load product:', error.message);
        if (data) void attachPromotions([data]).then((items) => { if (!cancelled) setProduct(items[0] ?? null); });
        else setProduct(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading };
}

export function useNavigation() {
  const [page, setPage] = useState<Page>({ name: 'home' });

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { page, navigate };
}
