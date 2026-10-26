import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Page } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface CartPageProps {
  navigate: (page: Page) => void;
}

export default function CartPage({ navigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  const shippingFee = totalAmount >= 2000000 || totalAmount === 0 ? 0 : 50000;
  const grandTotal = totalAmount + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container-max px-4 py-20 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-cream-200 text-secondary-300">
            <ShoppingBag className="w-12 h-12" />
          </div>
        </div>
        <h1 className="font-serif text-2xl font-bold text-secondary-900 mb-3">
          Giỏ Hàng Trống
        </h1>
        <p className="text-secondary-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
          Tiếp Tục Mua Sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container-max px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold text-secondary-900 mb-2">
        Giỏ Hàng ({totalItems})
      </h1>
      <p className="text-sm text-secondary-600 mb-8">
        {totalAmount >= 2000000
          ? 'Đơn hàng của bạn được miễn phí giao hàng!'
          : `Thêm ${formatVND(2000000 - totalAmount)} để được miễn phí giao hàng`}
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card p-4 flex gap-4">
              <img
                src={item.product.image_url || ''}
                alt={item.product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                onClick={() => navigate({ name: 'product', slug: item.product.slug })}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <h3
                      className="font-serif text-base font-semibold text-secondary-900 line-clamp-2 cursor-pointer hover:text-primary-700 transition-colors"
                      onClick={() => navigate({ name: 'product', slug: item.product.slug })}
                    >
                      {item.product.name}
                    </h3>
                    {item.product.weight && (
                      <p className="text-xs text-secondary-400 mt-1">{item.product.weight}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 rounded-lg text-error-400 hover:bg-error-50 transition-colors flex-shrink-0"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3">
                  <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 rounded-md text-secondary-600 hover:bg-white transition-colors"
                      aria-label="Giảm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-secondary-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 rounded-md text-secondary-600 hover:bg-white transition-colors"
                      aria-label="Tăng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg font-bold text-primary-700">
                      {formatVND(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-secondary-400">
                        {formatVND(item.product.price)} / sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate({ name: 'products' })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors pt-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Tiếp Tục Mua Sắm
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 lg:sticky lg:top-28">
            <h2 className="font-serif text-xl font-bold text-secondary-900 mb-4">
              Tổng Thanh Toán
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-secondary-600">
                <span>Tạm tính</span>
                <span className="font-medium text-secondary-900">{formatVND(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>Phí giao hàng</span>
                <span className="font-medium text-secondary-900">
                  {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream-200">
                <span className="font-medium text-secondary-900">Tổng cộng</span>
                <span className="font-serif text-2xl font-bold text-primary-700">
                  {formatVND(grandTotal)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate({ name: 'checkout' })}
              className="btn-primary w-full mt-5"
            >
              Tiến Hành Thanh Toán
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
