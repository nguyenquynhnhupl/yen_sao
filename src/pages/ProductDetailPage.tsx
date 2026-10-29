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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const galleryImages = Array.from(new Set([
    product.image_url,
    ...(product.detail_content ?? []).filter((block) => block.type === 'image').map((block) => block.content),
  ].filter((url): url is string => Boolean(url?.trim()))));
  const activeImage = selectedImage && galleryImages.includes(selectedImage) ? selectedImage : (galleryImages[0] ?? '');

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
    <div className="animate-fade-in min-h-screen bg-[#fbf8f2]">
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

      <div className="container-max px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <button
          onClick={() => navigate({ name: 'products' })}
          className="inline-flex items-center gap-2 rounded-full border border-[#e9dfd0] bg-white px-4 py-2 text-sm text-[#715b42] shadow-sm transition hover:border-[#b99a68] hover:text-[#8b6b3f] mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          {/* Product image gallery */}
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="relative overflow-hidden rounded-2xl border border-[#eee4d6] bg-white p-3 shadow-[0_12px_36px_rgba(74,52,25,0.07)] sm:p-4">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#fbf8f2]">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-[#9b8b75]">Chưa có hình ảnh sản phẩm</div>
                )}
              </div>
              {discount > 0 && (
                <span className="absolute left-6 top-6 rounded-full bg-[#8b3d2e] px-3.5 py-2 text-xs font-bold tracking-wide text-white shadow-md">
                  -{discount}%
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Ảnh sản phẩm">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                    aria-pressed={activeImage === image}
                    className={`h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition sm:h-[84px] sm:w-[84px] ${activeImage === image ? 'border-[#a1814e] shadow-sm' : 'border-[#eee4d6] hover:border-[#cbb58f]'}`}
                  >
                    <img src={image} alt={`${product.name} - ảnh ${index + 1}`} loading="lazy" className="h-full w-full rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.is_bestseller && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f0e4] px-3 py-1.5 text-xs font-bold tracking-wide text-[#8a6b3f]">
                <Check className="w-3 h-3" />
                Bestseller
              </span>
            )}

            <h1 className="font-serif text-2xl font-bold leading-tight text-[#332719] sm:text-3xl lg:text-[2.15rem]">
              {product.name}
            </h1>

            {/* Compact luxury product facts */}
            {product.quick_info && product.quick_info.filter((item) => item.label?.trim() && item.value?.trim()).length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-[#94764c]">Thông tin sản phẩm</h2>
                  <span className="h-px flex-1 bg-[#eee4d6]" />
                </div>
                <dl className="divide-y divide-[#f0e8dc] rounded-xl border border-[#eee4d6] bg-[#fdfbf7] px-4">
                  {product.quick_info.filter((item) => item.label?.trim() && item.value?.trim()).map((item, index) => (
                    <div key={index} className="grid grid-cols-[minmax(88px,0.36fr)_minmax(0,1fr)] gap-3 py-3">
                      <dt className="text-xs font-semibold text-[#987a51] sm:text-sm">{item.label}</dt>
                      <dd className="whitespace-pre-line break-words text-sm leading-relaxed text-[#514638]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {product.weight && (
              <p className="text-sm font-medium tracking-wide text-[#8c806e]">
                Khối lượng: {product.weight}
              </p>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1 border-y border-[#eee4d6] py-4">
              <p className="font-serif text-3xl font-bold tracking-tight text-[#805c2d] sm:text-4xl">
                {formatVND(product.price)}
              </p>
              {product.compare_price && (
                <p className="mb-1 text-base text-[#a69a88] line-through">
                  {formatVND(product.compare_price)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#edf5ed] px-3 py-1.5 text-xs font-semibold text-[#3f7548]">
                    <Check className="w-4 h-4" />
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                </>
              ) : (
                <span className="text-error-500 font-medium">Hết hàng</span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-secondary-700">Số lượng:</span>
              <div className="flex items-center gap-1 rounded-full border border-[#e9dfd0] bg-[#fcfaf6] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full p-2 text-[#6d5a43] transition hover:bg-white"
                  aria-label="Giảm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-semibold text-[#332719]">
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
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-outline flex-1 !rounded-full !py-3.5"
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
                className="btn-primary flex-1 !rounded-full !py-3.5"
              >
                Mua Ngay
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-[#eee4d6] pt-5">
              {[
                { icon: ShieldCheck, label: '100% Tự Nhiên' },
                { icon: Award, label: 'Chứng Nhận CL' },
                { icon: Truck, label: 'Giao Hàng Toàn Quốc' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-[#fbf7ef] px-2 py-3 text-center">
                  <badge.icon className="h-5 w-5 text-[#a1814e]" />
                  <span className="text-[10px] font-semibold leading-snug text-[#6b5a43] sm:text-xs">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed content from CMS — text and uploaded images */}
        {product.detail_content && product.detail_content.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-[#e9dfd0] bg-white shadow-[0_14px_45px_rgba(74,52,25,0.05)]">
            <div className="border-b border-[#eee4d6] bg-[#fbf7ef] px-5 py-5 sm:px-8"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1814e]">Tìm hiểu thêm</p><h2 className="font-serif text-2xl font-bold text-[#332719]">Mô tả sản phẩm chi tiết</h2><p className="mt-1 text-sm text-secondary-500">Thông tin chi tiết về sản phẩm</p></div>
            <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
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
          <div className="mt-14">
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
