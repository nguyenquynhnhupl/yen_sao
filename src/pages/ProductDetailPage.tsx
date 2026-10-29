import { useState } from 'react';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Award,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { useProduct, useProducts } from '@/lib/hooks';
import { useCart } from '@/context/CartContext';
import type { Page } from '@/lib/types';
import { formatVND } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  navigate: (page: Page) => void;
}

export default function ProductDetailPage({ slug, navigate }: ProductDetailPageProps) {
  const { product, loading } = useProduct(slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { products: related } = useProducts({ limit: 4 });

  if (loading) {
    return (
      <div className="container-max px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-cream-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-200 rounded animate-pulse" />
            <div className="h-6 bg-cream-200 rounded w-2/3 animate-pulse" />
            <div className="h-32 bg-cream-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-max px-4 py-20 text-center animate-fade-in">
        <h1 className="font-serif text-2xl font-bold text-secondary-900 mb-4">
          Không tìm thấy sản phẩm
        </h1>
        <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
          Quay Lại Sản Phẩm
        </button>
      </div>
    );
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate({ name: 'checkout' });
  };

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
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-700 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: 'products' })}
          className="inline-flex items-center gap-1.5 text-sm text-secondary-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-cream-100 ring-1 ring-cream-200 shadow-sm">
              <img
                src={product.image_url || ''}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 rounded-full bg-error-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.is_bestseller && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">
                <Check className="w-3 h-3" />
                Bestseller
              </span>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-secondary-900 leading-tight">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="text-secondary-600 leading-relaxed">{product.short_description}</p>
            )}

            {product.weight && (
              <p className="text-sm text-secondary-400 uppercase tracking-wide font-medium">
                Khối lượng: {product.weight}
              </p>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 py-4 border-y border-cream-200">
              <p className="font-serif text-3xl font-bold text-primary-700">
                {formatVND(product.price)}
              </p>
              {product.compare_price && (
                <p className="text-lg text-secondary-400 line-through mb-1">
                  {formatVND(product.compare_price)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="flex items-center gap-1 text-success-600 font-medium">
                    <Check className="w-4 h-4" />
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                </>
              ) : (
                <span className="text-error-500 font-medium">Hết hàng</span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-secondary-700">Số lượng:</span>
              <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-md text-secondary-600 hover:bg-white transition-colors"
                  aria-label="Giảm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-base font-semibold text-secondary-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-md text-secondary-600 hover:bg-white transition-colors"
                  aria-label="Tăng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-outline flex-1"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã Thêm Vào Giỏ
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Thêm Vào Giỏ
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="btn-primary flex-1"
              >
                Mua Ngay
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: ShieldCheck, label: '100% Tự Nhiên' },
                { icon: Award, label: 'Chứng Nhận CL' },
                { icon: Truck, label: 'Giao Hàng Toàn Quốc' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-cream-100">
                  <badge.icon className="w-5 h-5 text-primary-600" />
                  <span className="text-xs font-medium text-secondary-700">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick info from CMS — shown on product detail / booking page */}
        {product.quick_info && product.quick_info.length > 0 && (
          <section className="mt-12 overflow-hidden rounded-2xl border border-[#e9dfd0] bg-white shadow-sm">
            <div className="border-b border-[#eee4d6] bg-[#fbf7ef] px-5 py-4 sm:px-7"><h2 className="font-serif text-2xl font-bold text-secondary-900">Thông tin nhanh</h2><p className="mt-1 text-sm text-secondary-500">Thông số và đặc điểm sản phẩm</p></div>
            <dl className="grid gap-x-8 px-5 py-3 sm:grid-cols-2 sm:px-7">
              {product.quick_info.filter((item) => item.label?.trim() && item.value?.trim()).map((item, index) => (
                <div key={index} className="grid grid-cols-[minmax(100px,0.7fr)_minmax(0,1.3fr)] gap-3 border-b border-cream-200 py-4 last:border-b-0">
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#9a7950]">{item.label}</dt>
                  <dd className="whitespace-pre-line text-sm leading-relaxed text-secondary-700">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Detailed content from CMS — text and uploaded images */}
        {product.detail_content && product.detail_content.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-[#e9dfd0] bg-white shadow-sm">
            <div className="border-b border-[#eee4d6] bg-[#fbf7ef] px-5 py-4 sm:px-7"><h2 className="font-serif text-2xl font-bold text-secondary-900">Mô tả sản phẩm chi tiết</h2><p className="mt-1 text-sm text-secondary-500">Thông tin chi tiết về sản phẩm</p></div>
            <div className="space-y-5 px-5 py-6 sm:px-7">
              {product.detail_content.map((block, index) => block.type === 'image' ? (
                <img key={index} src={block.content} alt={product.name} loading="lazy" className="mx-auto max-h-[680px] w-full rounded-xl object-contain" />
              ) : (
                <p key={index} className="whitespace-pre-line leading-7 text-secondary-700">{block.content}</p>
              ))}
            </div>
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-secondary-900 mb-6">
              Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} navigate={navigate} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
