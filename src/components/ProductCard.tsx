import { Plus, Star, Eye, ShoppingBag, Flame, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product, Page } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  navigate: (page: Page) => void;
  flashSaleCountdown?: string;
  flashSaleExpired?: boolean;
  variant?: 'default' | 'flash-sale';
}

function getDemoSoldCount(product: Product): number {
  const key = String(product.id || product.slug || product.name || 'yen-sao');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return 89 + (hash % 168);
}

export default function ProductCard({ product, navigate, flashSaleCountdown, flashSaleExpired = false, variant = 'default' }: ProductCardProps) {
  const isFlashSale = variant === 'flash-sale';
  const { addToCart } = useCart();
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const soldCount = product.sold_count;
  const totalUnits = soldCount == null ? 0 : soldCount + product.stock;
  const salesProgress = totalUnits > 0 ? Math.min(100, Math.round((soldCount! / totalUnits) * 100)) : 0;

  return (
    <article
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isFlashSale ? 'min-w-0 border-gray-200 shadow-sm' : 'rounded-2xl border-[#e9dfd0] shadow-[0_4px_18px_rgba(71,49,25,0.06)] hover:border-[#c6a66b] hover:shadow-[0_14px_32px_rgba(71,49,25,0.14)]'}`}
      onClick={() => navigate({ name: 'product', slug: product.slug })}
    >
      <div className={`relative aspect-square w-full overflow-hidden bg-[#f8f5ed] ${flashSaleExpired ? 'bg-gray-100' : ''}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] ${flashSaleExpired ? 'opacity-50 grayscale' : ''} `} />
        ) : <div className="flex h-full w-full items-center justify-center text-sm text-[#9b8a72]">Chưa có hình ảnh</div>}

        {isFlashSale ? (
          <>
            <span className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[11px] font-extrabold text-white shadow-sm ${flashSaleExpired ? 'bg-gray-500' : 'bg-[#C9362B]'}`}>
              {flashSaleExpired ? 'HẾT DEAL' : discount > 0 ? `-${discount}%` : 'FLASH SALE'}
            </span>
            {flashSaleCountdown && !flashSaleExpired && (
              <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-md bg-black/75 px-1.5 py-1.5 text-white backdrop-blur-sm">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="font-mono text-[10px] font-bold tabular-nums tracking-wide sm:text-xs">{flashSaleCountdown}</span>
              </div>
            )}
            {flashSaleExpired && <div className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-gray-700/85 px-2 py-1.5 text-center text-[10px] font-bold tracking-wide text-white">ƯU ĐÃI ĐÃ KẾT THÚC</div>}
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

      <div className={`flex flex-1 flex-col ${isFlashSale ? 'p-2.5 sm:p-3' : 'p-4 sm:p-5'}`}>
        {product.weight && <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a18a68]">{product.weight}</p>}
        <h3 className={`mb-2 line-clamp-2 min-h-[2.5rem] font-sans font-semibold leading-5 text-[#333] transition-colors group-hover:text-[#8a6738] ${isFlashSale ? 'text-[13px] sm:text-sm' : 'text-[15px] sm:text-base'}`}>{product.name}</h3>
        {!isFlashSale && product.short_description && <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#827568]">{product.short_description}</p>}

        <div className={`mt-auto ${isFlashSale ? 'border-t border-gray-100 pt-2' : 'border-t border-[#f0e9df] pt-3'}`}>
          <div className={`flex items-end justify-between gap-1.5 ${isFlashSale ? 'min-h-[42px]' : 'min-h-[54px]'}`}>
            <div className="min-w-0">
              <p className={`font-sans font-extrabold leading-tight tracking-tight ${isFlashSale ? 'text-[15px] text-[#C9362B] sm:text-base' : 'text-lg text-[#654321] sm:text-xl'}`}>{formatVND(product.price)}</p>
              {discount > 0 && <p className="mt-0.5 text-[11px] font-medium text-[#999] line-through">{formatVND(product.compare_price!)}</p>}
              {discount === 0 && !isFlashSale && <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-wider text-[#8b8176]">Giá bán</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (!flashSaleExpired && product.stock > 0) addToCart(product); }}
              disabled={product.stock <= 0 || (isFlashSale && flashSaleExpired)}
              className={`flex shrink-0 items-center justify-center rounded-lg text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 ${isFlashSale ? 'h-8 px-2.5 text-[11px] font-bold' : 'h-10 w-10 rounded-xl bg-[#344b38] hover:bg-[#263a2a]'} ${isFlashSale && !flashSaleExpired ? 'bg-[#C9362B] hover:bg-[#A92D25]' : ''}`}
              aria-label={isFlashSale ? (flashSaleExpired ? 'Hết giờ' : 'Mua ngay') : 'Thêm vào giỏ hàng'}
            >
              {isFlashSale ? (flashSaleExpired ? 'Hết giờ' : 'Mua ngay') : <Plus className="h-5 w-5" />}
            </button>
          </div>

          {isFlashSale ? (
            soldCount != null && totalUnits > 0 ? (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between gap-1 text-[10px] text-[#81776D]">
                  <span>Đã bán {soldCount}</span>
                  <span>{salesProgress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-gradient-to-r from-[#D94A36] to-[#F08A54]" style={{ width: `${salesProgress}%` }} /></div>
              </div>
            ) : <p className="mt-2 text-[10px] text-[#9A9085]">Ưu đãi có thời hạn</p>
          ) : (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-medium text-[#857665]"><span className="inline-flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Đã bán</span><span className="font-bold text-[#6e5131]">{getDemoSoldCount(product).toLocaleString('vi-VN')} sản phẩm</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#eee7dc]"><div className="h-full rounded-full bg-gradient-to-r from-[#b38a4a] to-[#dfbd7b] transition-all duration-500" style={{ width: `${Math.min(100, Math.max(8, Math.round((getDemoSoldCount(product) / 300) * 100)))}%` }} /></div>
            </div>
          )}
          {!isFlashSale && product.stock <= 0 && <p className="mt-2 text-xs font-semibold text-[#b33b32]">Tạm hết hàng</p>}
        </div>
      </div>
    </article>
  );
}
