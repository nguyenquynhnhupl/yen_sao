import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import type { Page } from '@/lib/types';

interface OrderSuccessPageProps {
  orderNumber: string;
  navigate: (page: Page) => void;
}

export default function OrderSuccessPage({ orderNumber, navigate }: OrderSuccessPageProps) {
  return (
    <div className="container-max px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-success-200 rounded-full animate-ping opacity-30" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-success-100">
              <CheckCircle className="w-12 h-12 text-success-600" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-secondary-900">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-secondary-600">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
          </p>
        </div>

        <div className="card p-6 space-y-3 text-left">
          <div className="flex items-center gap-3 pb-3 border-b border-cream-200">
            <Package className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-secondary-500">Mã đơn hàng</p>
              <p className="font-serif text-lg font-bold text-primary-700">{orderNumber}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-600">Phương thức thanh toán</span>
              <span className="font-medium text-secondary-900">COD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Trạng thái</span>
              <span className="inline-flex items-center gap-1 text-warning-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-warning-500" />
                Chờ xác nhận
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button onClick={() => navigate({ name: 'home' })} className="btn-outline">
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </button>
          <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
            <ShoppingBag className="w-4 h-4" />
            Tiếp Tục Mua Sắm
          </button>
        </div>

        <p className="text-xs text-secondary-400 pt-4">
          Vui lòng lưu lại mã đơn hàng để tra cứu. Hotline hỗ trợ: 1900 xxxx
        </p>
      </div>
    </div>
  );
}
