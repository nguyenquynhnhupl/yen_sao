import { Plus, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product, Page } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  navigate: (page: Page) => void;
}

export default function ProductCard({ product, navigate }: ProductCardProps) {
  const { addToCart } = useCart();

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      className="card group cursor-pointer overflow-hidden hover:shadow-xl hover:ring-primary-200"
      onClick={() => navigate({ name: 'product', slug: product.slug })}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <img
          src={product.image_url || ''}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
              <Star className="w-2.5 h-2.5 fill-white" />
              BESTSELLER
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-error-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-white/95 rounded-full px-4 py-2 text-xs font-semibold text-primary-700 shadow-lg translate-y-2 group-hover:translate-y-0">
            <Eye className="w-3.5 h-3.5" />
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {product.weight && (
          <p className="text-[11px] text-secondary-400 uppercase tracking-wide font-medium">
            {product.weight}
          </p>
        )}
        <h3 className="font-serif text-base font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-xs text-secondary-500 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        )}

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-0.5">
            <p className="font-serif text-lg font-bold text-primary-700">
              {formatVND(product.price)}
            </p>
            {product.compare_price && (
              <p className="text-xs text-secondary-400 line-through">
                {formatVND(product.compare_price)}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock <= 0}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all disabled:bg-secondary-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label="Thêm vào giỏ"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {product.stock <= 0 && (
          <p className="text-xs text-error-500 font-medium">Hết hàng</p>
        )}
      </div>
    </div>
  );
}
