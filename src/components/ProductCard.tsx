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
  const soldCount = product.sold_count;
  const totalUnits = soldCount == null ? 0 : soldCount + product.stock;
  const salesProgress = totalUnits > 0 ? Math.min(100, Math.round((soldCount! / totalUnits) * 100)) : 0;

  return (
    <article
      className={`group flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-200 ${isFlashSale ? 'min-w-0 rounded-[14px] border border-[#293147] bg-[#171E30] shadow-sm hover:-translate-y-0.5 hover:border-[#3B4762] hover:shadow-lg' : 'rounded-2xl border border-[#e9dfd0] bg-white shadow-[0_4px_18px_rgba(71,49,25,0.06)] hover:-translate-y-1 hover:border-[#c6a66b] hover:shadow-[0_14px_32px_rgba(71,49,25,0.14)]'}`}
      onClick={() => navigate({ name: 'product', slug: product.slug })}
    >
      <div className={`relative w-full overflow-hidden ${isFlashSale ? 'aspect-square bg-[#222A3B]' : 'aspect-[4/3] bg-[#f8f5ed]'} ${flashSaleExpired ? 'bg-gray-100' : ''}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] ${flashSaleExpired ? 'opacity-50 grayscale' : ''}`} />
        ) : <div className="flex h-full w-full items-center justify-center text-sm text-[#9b8a72]">Chưa có hình ảnh</div>}

        {isFlashSale ? (
          <>
            <span className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[11px] font-extrabold text-white shadow-sm ${flashSaleExpired ? 'bg-gray-500' : 'bg-[#EC0750]'}`}>
              {flashSaleExpired ? 'HẾT DEAL' : discount > 0 ? `-${discount}%` : 'FLASH SALE'}
            </span>
            {(flashSaleCountdown || flashSaleUpcoming) && !flashSaleExpired && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-[#080D19]/85 px-2 py-1.5 text-white backdrop-blur-sm">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#D7DCE7]"><Clock className="h-3 w-3 text-[#FF6979]" />{flashSaleUpcoming ? 'Sắp mở' : 'Còn'}</span>
                <span className="font-mono text-[10px] font-bold tabular-nums tracking-wide text-[#FFD45B]">{flashSaleUpcoming ? 'CHỜ MỞ' : flashSaleCountdown}</span>
              </div>
            )}
            {flashSaleExpired && <div className="absolute inset-x-0 bottom-0 bg-[#7E2439]/90 px-2 py-1.5 text-center text-[10px] font-bold tracking-wide text-white">◉ HẾT HẠN</div>}
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
        {product.weight && <p className={`mb-1 text-[9px] font-bold uppercase tracking-[0.12em] ${isFlashSale ? 'text-[#A9B3C7]' : 'text-[#a18a68]'}`}>{product.weight}</p>}
        <h3 className={`mb-2 line-clamp-2 min-h-[2.5rem] font-sans font-semibold leading-5 transition-colors ${isFlashSale ? 'text-[13px] text-[#F2F4F8] sm:text-sm group-hover:text-white' : 'text-[15px] text-[#333] group-hover:text-[#8a6738] sm:text-base'}`}>{product.name}</h3>
        {!isFlashSale && product.short_description && <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#827568]">{product.short_description}</p>}

        <div className={`mt-auto ${isFlashSale ? 'border-t border-[#293147] pt-2' : 'border-t border-[#f0e9df] pt-3'}`}>
          <div className={`flex items-end justify-between gap-1.5 ${isFlashSale ? 'min-h-[42px]' : 'min-h-[54px]'}`}>
            <div className="min-w-0">
              <p className={`font-sans font-extrabold leading-tight tracking-tight ${isFlashSale ? 'text-[15px] text-[#FF3C68] sm:text-base' : 'text-lg text-[#654321] sm:text-xl'}`}>{formatVND(product.price)}</p>
              {discount > 0 && <p className={`mt-0.5 text-[11px] font-medium line-through ${isFlashSale ? 'text-[#8B94A7]' : 'text-[#999]'}`}>{formatVND(product.compare_price!)}</p>}
              {discount === 0 && !isFlashSale && <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-wider text-[#8b8176]">Giá bán</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (!flashSaleExpired && !flashSaleUpcoming && product.stock > 0) addToCart(product); }}
              disabled={product.stock <= 0 || (isFlashSale && (flashSaleExpired || flashSaleUpcoming))}
              className={`flex shrink-0 items-center justify-center gap-1 rounded-lg text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:bg-[#252D40] disabled:text-[#657087] ${isFlashSale ? 'h-8 px-2.5 text-[11px] font-bold' : 'h-10 w-10 rounded-xl bg-[#344b38] hover:bg-[#263a2a] disabled:bg-[#c9c5bd]'} ${isFlashSale && !flashSaleExpired && !flashSaleUpcoming ? 'bg-[#E90D4B] hover:bg-[#C90B40]' : ''}`}
              aria-label={isFlashSale ? (flashSaleExpired ? 'Hết giờ' : flashSaleUpcoming ? 'Sắp mở bán' : 'Mua ngay') : 'Thêm vào giỏ hàng'}
            >
              {isFlashSale ? (flashSaleExpired ? 'Hết Giờ' : flashSaleUpcoming ? 'Sắp mở' : '🛒 Mua') : <Plus className="h-5 w-5" />}
            </button>
          </div>

          {isFlashSale ? (
            soldCount != null && totalUnits > 0 ? (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between gap-1 text-[10px] text-[#AAB3C4]">
                  <span>Đã bán {soldCount}</span>
                  <span>{salesProgress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#343D52]"><div className="h-full rounded-full bg-gradient-to-r from-[#F21A51] to-[#FF5A36]" style={{ width: `${salesProgress}%` }} /></div>
              </div>
            ) : <p className="mt-2 text-[10px] text-[#AAB3C4]">Ưu đãi có thời hạn</p>
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
