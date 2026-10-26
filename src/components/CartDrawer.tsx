import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatVND, type Page } from '@/lib/types';

interface CartDrawerProps {
  navigate: (page: Page) => void;
}

export default function CartDrawer({ navigate }: CartDrawerProps) {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-cream-50 shadow-2xl animate-slide-in-right flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <h2 className="font-serif text-lg font-bold text-secondary-900">
              Giỏ Hàng {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-secondary-500 hover:bg-cream-200 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-cream-200 text-secondary-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-secondary-500 font-medium">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={() => {
                  closeCart();
                  navigate({ name: 'products' });
                }}
                className="btn-primary"
              >
                Tiếp Tục Mua Sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-white rounded-xl p-3 ring-1 ring-cream-200"
                >
                  <img
                    src={item.product.image_url || ''}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-secondary-900 line-clamp-2 leading-snug">
                      {item.product.name}
                    </h3>
                    {item.product.weight && (
                      <p className="text-xs text-secondary-400 mt-0.5">{item.product.weight}</p>
                    )}
                    <p className="text-sm font-semibold text-primary-700 mt-1">
                      {formatVND(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-md text-secondary-600 hover:bg-white transition-colors"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-secondary-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-md text-secondary-600 hover:bg-white transition-colors"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-error-400 hover:bg-error-50 transition-colors"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Tạm tính</span>
              <span className="font-serif text-xl font-bold text-primary-700">
                {formatVND(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-secondary-400">
              {totalAmount >= 2000000
                ? 'Miễn phí giao hàng'
                : `Thêm ${formatVND(2000000 - totalAmount)} để được miễn phí giao hàng`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  closeCart();
                  navigate({ name: 'products' });
                }}
                className="btn-outline flex-1"
              >
                Tiếp Tục
              </button>
              <button
                onClick={() => {
                  closeCart();
                  navigate({ name: 'checkout' });
                }}
                className="btn-primary flex-1"
              >
                Thanh Toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
