import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks';
import type { Page } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductsPageProps {
  navigate: (page: Page) => void;
  categorySlug?: string;
  searchQuery?: string;
}

export default function ProductsPage({ navigate, categorySlug, searchQuery }: ProductsPageProps) {
  const { categories } = useCategories();
  const { products, loading } = useProducts({ categorySlug });
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [search, setSearch] = useState(searchQuery ?? '');
  useEffect(() => { setSearch(searchQuery ?? ''); }, [searchQuery]);
  const [maxPrice, setMaxPrice] = useState('');

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const sortedProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');
    const filtered = products.filter((product) => (!query || product.name.toLocaleLowerCase('vi').includes(query)) && (!maxPrice || product.price <= Number(maxPrice)));
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, sortBy, search, maxPrice]);

  return (
    <div className="animate-fade-in">
      <div className="bg-cream-100 border-b border-cream-200">
        <div className="container-max px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-secondary-500">
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary-600 transition-colors">Trang Chủ</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate({ name: 'products' })} className="hover:text-primary-600 transition-colors">Sản Phẩm</button>
            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary-700 font-medium">{activeCategory.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit min-w-0 rounded-2xl border border-cream-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary-700" />
              <h2 className="font-serif text-xl sm:text-[21px] font-bold text-secondary-900">Bộ lọc sản phẩm</h2>
            </div>
            <label className="mb-2 block text-base sm:text-[16px] font-semibold text-secondary-800">Tìm sản phẩm</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nhập tên sản phẩm..." className="mb-5 w-full rounded-lg border border-cream-300 px-3 py-3 text-[15px] sm:text-base outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />

            <div className="mb-5">
              <h3 className="mb-3 text-base font-semibold text-secondary-800">Danh mục</h3>
              <div className="space-y-2">
                <button onClick={() => navigate({ name: 'products' })} className={`block w-full rounded-lg px-3 py-2.5 text-left text-[15px] sm:text-base leading-snug transition ${!categorySlug ? 'bg-primary-50 font-semibold text-primary-800' : 'text-secondary-700 hover:bg-cream-100'}`}>Tất cả sản phẩm</button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => navigate({ name: 'products', categorySlug: cat.slug })} className={`block w-full rounded-lg px-3 py-2.5 text-left text-[15px] sm:text-base leading-snug transition ${categorySlug === cat.slug ? 'bg-primary-50 font-semibold text-primary-800' : 'text-secondary-700 hover:bg-cream-100'}`}>{cat.name}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-base font-semibold text-secondary-800">Khoảng giá tối đa (VNĐ)</label>
              <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Ví dụ: 2000000" className="w-full rounded-lg border border-cream-300 px-3 py-3 text-[15px] sm:text-base outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
            <button onClick={() => { setSearch(''); setMaxPrice(''); setSortBy('default'); navigate({ name: 'products' }); }} className="w-full rounded-lg border border-primary-700 px-4 py-3 text-[15px] sm:text-base font-semibold text-primary-700 transition hover:bg-primary-50">Xóa bộ lọc</button>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm sm:text-base text-secondary-600">{loading ? 'Đang tải...' : `${sortedProducts.length} sản phẩm`}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-secondary-600">Sắp xếp:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="rounded-lg border border-cream-300 bg-white px-3 py-2.5 text-sm sm:text-base text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500">
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid min-w-0 grid-cols-1 min-[520px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
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
                <button onClick={() => navigate({ name: 'products' })} className="btn-primary mt-4">Xem Tất Cả Sản Phẩm</button>
              </div>
            ) : (
              <div className="grid min-w-0 grid-cols-1 min-[520px]:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {sortedProducts.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
