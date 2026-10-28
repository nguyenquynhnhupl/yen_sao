import { Plus, Star, Eye, ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product, Page } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  navigate: (page: Page) => void;
}

// Mock display values only; deterministic per product and stable after refresh.
function getDemoSoldCount(product: Product): number {
  const key = String(product.id || product.slug || product.name || 'yen-sao');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return 89 + (hash % 168);
}

export default function ProductCard({ product, navigate }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const soldCount = getDemoSoldCount(product);
  const salesProgress = Math.min(100, Math.max(8, Math.round((soldCount / 300) * 100)));

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#e9dfd0] bg-white shadow-[0_4px_18px_rgba(71,49,25,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a66b] hover:shadow-[0_14px_32px_rgba(71,49,25,0.14)]"
      onClick={() => navigate({ name: 'product', slug: product.slug })}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f8f5ed]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#9b8a72]">Chưa có hình ảnh</div>
        )}

        <div className="absolute left-3 top-3 flex max-w-[75%] flex-col items-start gap-2">
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#a82e24] to-[#d94a36] px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-lg ring-1 ring-white/30">
              <Flame className="h-3.5 w-3.5" /> GIẢM {discount}%
            </span>
          )}
          {product.is_bestseller && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#e7cf9b] bg-[#fff8e8] px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider text-[#815b1b] shadow-sm">
              <Star className="h-3 w-3 fill-current" /> BÁN CHẠY
            </span>
          )}
          {product.is_featured && !product.is_bestseller && (
            <span className="rounded-md bg-[#273f30] px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white shadow-sm">NỔI BẬT</span>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#9e3028] shadow-sm">
            Tiết kiệm {formatVND(product.compare_price! - product.price)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center bg-gradient-to-t from-black/45 to-transparent pb-4 pt-8 transition-transform duration-300 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#654a2d] shadow-lg">
            <Eye className="h-3.5 w-3.5" /> Xem chi tiết
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.weight && <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a18a68]">{product.weight}</p>}
        <h3 className="mb-2 line-clamp-2 min-h-[2.8rem] font-serif text-[15px] font-bold leading-6 text-[#35291f] transition-colors group-hover:text-[#8a6738] sm:text-base">
          {product.name}
        </h3>
        {product.short_description && <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#827568]">{product.short_description}</p>}

        <div className="mt-auto border-t border-[#f0e9df] pt-3">
          <div className="flex min-h-[54px] items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-serif text-lg font-extrabold leading-tight text-[#75512b] sm:text-xl">{formatVND(product.price)}</p>
              {discount > 0 && <p className="mt-1 text-xs font-medium text-[#9c9185] line-through">{formatVND(product.compare_price!)}</p>}
              {discount === 0 && <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#a69a8c]">Giá bán</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (product.stock > 0) addToCart(product); }}
              disabled={product.stock <= 0}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#344b38] text-white shadow-sm transition hover:bg-[#263a2a] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-[#c9c5bd]"
              aria-label="Thêm vào giỏ hàng"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-medium text-[#857665]">
              <span className="inline-flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Đã bán</span>
              <span className="font-bold text-[#6e5131]">{soldCount.toLocaleString('vi-VN')} sản phẩm</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#eee7dc]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#b38a4a] to-[#dfbd7b] transition-all duration-500" style={{ width: `${salesProgress}%` }} />
            </div>
          </div>
          {product.stock <= 0 && <p className="mt-2 text-xs font-semibold text-[#b33b32]">Tạm hết hàng</p>}
        </div>
      </div>
    </article>
  );
}
