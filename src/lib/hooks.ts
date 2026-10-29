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
      .select('*, categories!inner(slug)')
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
          setProducts((data ?? []).map(mapProduct));
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
        setProduct(data ? mapProduct(data) : null);
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
