import { Plus, Star, Eye, ShoppingBag, Flame, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product, Page } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  navigate: (page: Page) => void;
  flashSaleCountdown?: string;
  flashSaleExpired?: boolean;
  flashSaleUpcoming?: boolean;
  variant?: 'default' | 'flash-sale';
}

function getDemoSoldCount(product: Product): number {
  const key = String(product.id || product.slug || product.name || 'yen-sao');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return 89 + (hash % 168);
}

export default function ProductCard({ product, navigate, flashSaleCountdown, flashSaleExpired = false, flashSaleUpcoming = false, variant = 'default' }: ProductCardProps) {
  const isFlashSale = variant === 'flash-sale';
  const { addToCart } = useCart();
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const demoSoldCount = getDemoSoldCount(product);
  const flashSaleSoldCount = 98;
  const flashSaleProgress = Math.round((flashSaleSoldCount / 300) * 100);

  return (
    <article
      className={`group flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-200 ${isFlashSale ? 'min-w-0 rounded-[14px] border border-[#E8DFCF] bg-[#FFFDF8] shadow-sm hover:-translate-y-0.5 hover:border-[#C5A46A] hover:shadow-[0_10px_24px_rgba(71,49,25,0.12)]' : 'rounded-2xl border border-[#e9dfd0] bg-white shadow-[0_4px_18px_rgba(71,49,25,0.06)] hover:-translate-y-1 hover:border-[#c6a66b] hover:shadow-[0_14px_32px_rgba(71,49,25,0.14)]'}`}
      onClick={() => navigate({ name: 'product', slug: product.slug })}
    >
      <div className={`relative w-full overflow-hidden ${isFlashSale ? 'aspect-[5/4] bg-[#F2E9D7]' : 'aspect-[4/3] bg-[#f8f5ed]'} ${flashSaleExpired ? 'bg-gray-100' : ''}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] ${flashSaleExpired ? 'opacity-50 grayscale' : ''}`} />
        ) : <div className="flex h-full w-full items-center justify-center text-sm text-[#9b8a72]">Chưa có hình ảnh</div>}

        {isFlashSale ? (
          <>
            <span className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[11px] font-extrabold text-white shadow-sm ${flashSaleExpired ? 'bg-gray-500' : 'bg-[#9B3028]'}`}>
              {flashSaleExpired ? 'HẾT DEAL' : discount > 0 ? `-${discount}%` : 'FLASH SALE'}
            </span>
            {(flashSaleCountdown || flashSaleUpcoming) && !flashSaleExpired && (
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-lg border border-[#E5C58F]/80 bg-[#123326] px-2 py-1.5 text-white shadow-[0_3px_12px_rgba(0,0,0,0.45)] ring-1 ring-black/20">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#FFF8E9]"><Clock className="h-3.5 w-3.5 text-[#F0D28E]" />{flashSaleUpcoming ? 'Sắp mở' : 'Còn'}</span>
                <span className="font-mono text-[10px] font-extrabold tabular-nums tracking-wide text-[#FFE09A]">{flashSaleUpcoming ? 'CHỜ MỞ' : flashSaleCountdown}</span>
              </div>
            )}
            {flashSaleExpired && <div className="absolute inset-x-2 bottom-2 rounded-md bg-[#7A302A]/90 px-2 py-1.5 text-center text-[10px] font-bold tracking-wide text-white">◉ HẾT HẠN</div>}
          </>
        ) : (
          <>
            <div className="absolute left-3 top-3 flex max-w-[75%] flex-col items-start gap-2">
              {discount > 0 && <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#a82e24] to-[#d94a36] px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-lg ring-1 ring-white/30"><Flame className="h-3.5 w-3.5" /> GIẢM {discount}%</span>}
              {product.is_bestseller && <span className="inline-flex items-center gap-1 rounded-md border border-[#e7cf9b] bg-[#fff8e8] px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider text-[#815b1b] shadow-sm"><Star className="h-3 w-3 fill-current" /> BÁN CHẠY</span>}
              {product.is_featured && !product.is_bestseller && <span className="rounded-md bg-[#273f30] px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white shadow-sm">NỔI BẬT</span>}
            </div>
            {discount > 0 && <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#9e3028] shadow-sm">Tiết kiệm {formatVND(product.compare_price! - product.price)}</span>}
            <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center bg-gradient-to-t from-black/45 to-transparent pb-4 pt-8 transition-transform duration-300 group-hover:translate-y-0"><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#654a2d] shadow-lg"><Eye className="h-3.5 w-3.5" /> Xem chi tiết</span></div>
          </>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${isFlashSale ? 'p-2 sm:p-2.5' : 'p-4 sm:p-5'}`}>
        {product.weight && <p className={`mb-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${isFlashSale ? 'text-[#9A7846]' : 'text-[#a18a68]'}`}>{product.weight}</p>}
        <h3 className={`mb-2 line-clamp-2 min-h-[2.5rem] font-sans font-semibold leading-5 transition-colors ${isFlashSale ? 'min-h-[2rem] text-[12px] leading-4 text-[#243D30] sm:text-[13px] group-hover:text-[#9A7846]' : 'text-[15px] text-[#333] group-hover:text-[#8a6738] sm:text-base'}`}>{product.name}</h3>
        {!isFlashSale && product.short_description && <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#827568]">{product.short_description}</p>}

        <div className={`mt-auto ${isFlashSale ? 'border-t border-[#E8DFCF] pt-2' : 'border-t border-[#f0e9df] pt-3'}`}>
          <div className={`flex items-baseline gap-x-2 gap-y-0.5 ${isFlashSale ? 'min-h-[24px] flex-wrap' : 'min-h-[54px]'}`}>
            <p className={`font-sans font-extrabold leading-tight tracking-tight ${isFlashSale ? 'text-[13px] text-[#9B3028] sm:text-sm' : 'text-lg text-[#654321] sm:text-xl'}`}>{formatVND(product.price)}</p>
            {discount > 0 && <p className={`text-[11px] font-medium line-through ${isFlashSale ? 'text-[10px] text-[#8B8176]' : 'mt-0.5 text-[#999]'}`}>{formatVND(product.compare_price!)}</p>}
            {discount === 0 && !isFlashSale && <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-wider text-[#8b8176]">Giá bán</p>}
          </div>
          {!isFlashSale && (
            <button
              onClick={(e) => { e.stopPropagation(); if (product.stock > 0) addToCart(product); }}
              disabled={product.stock <= 0}
              className="mt-3 flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl bg-[#344b38] text-white shadow-sm transition hover:bg-[#263a2a] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#c9c5bd]"
              aria-label="Thêm vào giỏ hàng"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}

          {isFlashSale ? (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#E8DFCF]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#9B3028] to-[#C5A46A] transition-all duration-500" style={{ width: `${flashSaleProgress}%` }} />
              </div>
              <p className="mt-0.5 text-left text-[9px] font-medium text-[#817968]">Đã bán {flashSaleSoldCount}</p>
              <button
                onClick={(e) => { e.stopPropagation(); if (!flashSaleExpired && !flashSaleUpcoming && product.stock > 0) addToCart(product); }}
                disabled={product.stock <= 0 || flashSaleExpired || flashSaleUpcoming}
                className="mt-1.5 flex h-7 w-full items-center justify-center gap-1 rounded-md bg-[#E90D4B] px-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#C90B40] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#E9E0D0] disabled:text-[#817968]"
                aria-label={flashSaleExpired ? 'Hết giờ' : flashSaleUpcoming ? 'Sắp mở bán' : 'Mua ngay'}
              >
                {flashSaleExpired ? 'Hết Giờ' : flashSaleUpcoming ? 'Sắp mở' : '🛒 Mua'}
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-medium text-[#857665]"><span className="inline-flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Đã bán</span><span className="font-bold text-[#6e5131]">{demoSoldCount.toLocaleString('vi-VN')} sản phẩm</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#eee7dc]"><div className="h-full rounded-full bg-gradient-to-r from-[#b38a4a] to-[#dfbd7b] transition-all duration-500" style={{ width: `${Math.min(100, Math.max(8, Math.round((demoSoldCount / 300) * 100)))}%` }} /></div>
            </div>
          )}
          {!isFlashSale && product.stock <= 0 && <p className="mt-2 text-xs font-semibold text-[#b33b32]">Tạm hết hàng</p>}
        </div>
      </div>
    </article>
  );
}
