import { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { Page, OrderItemInput } from '@/lib/types';
import { formatVND } from '@/lib/types';

interface CheckoutPageProps {
  navigate: (page: Page) => void;
}

const CITIES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Nha Trang',
  'Cần Thơ', 'Biên Hòa', 'Huế', 'Vũng Tàu', 'Quy Nhơn',
  'Phan Thiết', 'Long Xuyên', 'Buôn Ma Thuột', 'Thái Nguyên', 'Nam Định',
];

export default function CheckoutPage({ navigate }: CheckoutPageProps) {
  const { items, totalAmount, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    city: '',
    note: '',
  });

  const shippingFee = totalAmount >= 2000000 || totalAmount === 0 ? 0 : 50000;
  const grandTotal = totalAmount + shippingFee;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Giỏ hàng của bạn đang trống.');
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phoneRegex.test(form.customer_phone)) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }

    setSubmitting(true);

    try {
      const orderNumber = `YS${Date.now().toString().slice(-8)}`;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email || null,
          shipping_address: form.shipping_address,
          city: form.city,
          note: form.note || null,
          total_amount: grandTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError || !orderData) {
        setError('Không thể tạo đơn hàng. Vui lòng thử lại.');
        setSubmitting(false);
        return;
      }

      const orderItems: OrderItemInput[] = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        order_id: orderData.id,
      })) as unknown as OrderItemInput[];

      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: orderData.id,
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }))
      );

      if (itemsError) {
        setError('Đã tạo đơn hàng nhưng không thể lưu chi tiết. Vui lòng liên hệ hotline.');
        setSubmitting(false);
        return;
      }

      clearCart();
      navigate({ name: 'order-success', orderNumber });
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="container-max px-4 py-20 text-center animate-fade-in">
        <h1 className="font-serif text-2xl font-bold text-secondary-900 mb-4">
          Giỏ Hàng Trống
        </h1>
        <p className="text-secondary-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
          Tiếp Tục Mua Sắm
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-cream-100 border-b border-cream-200">
        <div className="container-max px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: 'cart' })}
            className="inline-flex items-center gap-1.5 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </button>
        </div>
      </div>

      <div className="container-max px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-secondary-900 mb-8">Thanh Toán</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-secondary-900 mb-4">
                Thông Tin Giao Hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Họ và tên <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    className="input-field"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Số điện thoại <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    className="input-field"
                    placeholder="0901 234 567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => handleChange('customer_email', e.target.value)}
                    className="input-field"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Địa chỉ nhận hàng <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.shipping_address}
                    onChange={(e) => handleChange('shipping_address', e.target.value)}
                    className="input-field"
                    placeholder="Số nhà, đường, phường/xã"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Tỉnh/Thành phố <span className="text-error-500">*</span>
                  </label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-secondary-900 mb-4">
                Phương Thức Thanh Toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-primary-600" />
                  <Truck className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-secondary-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-secondary-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-cream-200 bg-white cursor-pointer opacity-60">
                  <input type="radio" name="payment" disabled className="text-primary-600" />
                  <CreditCard className="w-5 h-5 text-secondary-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-secondary-700">Chuyển khoản ngân hàng</p>
                    <p className="text-xs text-secondary-400">Sắp có</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-6">
            <div className="card p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-xl font-bold text-secondary-900 mb-4">
                Đơn Hàng Của Bạn
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image_url || ''}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-secondary-500">
                        {item.quantity} x {formatVND(item.product.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary-700 whitespace-nowrap">
                      {formatVND(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-cream-200 text-sm">
                <div className="flex justify-between text-secondary-600">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-cream-200">
                <span className="font-medium text-secondary-900">Tổng cộng</span>
                <span className="font-serif text-2xl font-bold text-primary-700">
                  {formatVND(grandTotal)}
                </span>
              </div>

              {error && (
                <p className="text-sm text-error-600 bg-error-50 rounded-lg p-3 mb-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang Xử Lý...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Đặt Hàng
                  </>
                )}
              </button>

              <p className="text-xs text-secondary-400 text-center mt-3">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản của chúng tôi
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
