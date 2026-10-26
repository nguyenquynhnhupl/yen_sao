import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, Page } from '@/lib/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setCategories(data as Category[]);
        setLoading(false);
      });
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
    let query = supabase
      .from('products')
      .select('*, categories!inner(slug)')
      .order('display_order', { ascending: true });

    if (options?.categorySlug) {
      query = query.eq('categories.slug', options.categorySlug);
    }
    if (options?.featured) {
      query = query.eq('is_featured', true);
    }
    if (options?.bestseller) {
      query = query.eq('is_bestseller', true);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    query.then(({ data, error }) => {
      if (!error && data) {
        setProducts(data as unknown as Product[]);
      }
      setLoading(false);
    });
  }, [options?.categorySlug, options?.featured, options?.bestseller, options?.limit]);

  return { products, loading };
}

export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProduct(data as Product);
        else setProduct(null);
        setLoading(false);
      });
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
