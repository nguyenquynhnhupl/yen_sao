import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks';
import type { Page } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductsPageProps {
  navigate: (page: Page) => void;
  categorySlug?: string;
}

export default function ProductsPage({ navigate, categorySlug }: ProductsPageProps) {
  const { categories } = useCategories();
  const { products, loading } = useProducts({ categorySlug });
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-cream-100 border-b border-cream-200">
        <div className="container-max px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-secondary-500">
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary-600 transition-colors">
              Trang Chủ
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate({ name: 'products' })} className="hover:text-primary-600 transition-colors">
              Sản Phẩm
            </button>
            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary-700 font-medium">{activeCategory.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
            {activeCategory ? activeCategory.name : 'Tất Cả Sản Phẩm'}
          </h1>
          {activeCategory?.description && (
            <p className="text-secondary-600">{activeCategory.description}</p>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => navigate({ name: 'products' })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              !categorySlug
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-secondary-700 ring-1 ring-cream-200 hover:ring-primary-300'
            }`}
          >
            Tất Cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'products', categorySlug: cat.slug })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                categorySlug === cat.slug
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-secondary-700 ring-1 ring-cream-200 hover:ring-primary-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-secondary-500">
            {loading ? 'Đang tải...' : `${sortedProducts.length} sản phẩm`}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-secondary-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4 space-y-3">
                <div className="aspect-[4/3] rounded-xl bg-cream-200 animate-pulse" />
                <div className="h-4 bg-cream-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-cream-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary-500 text-lg">Không tìm thấy sản phẩm nào trong danh mục này.</p>
            <button onClick={() => navigate({ name: 'products' })} className="btn-primary mt-4">
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
