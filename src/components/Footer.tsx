import { Phone, Mail, MapPin, Facebook, Award, Truck, ShieldCheck } from 'lucide-react';
import type { Page } from '@/lib/types';

interface FooterProps {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-primary-950 text-cream-200 mt-auto">
      {/* Trust badges */}
      <div className="border-b border-primary-800">
        <div className="container-max px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-800 text-accent-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Tự Nhiên</h4>
                <p className="text-xs text-cream-300">Không pha trộn, không tẩy trắng</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-800 text-accent-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Chứng Nhận CL</h4>
                <p className="text-xs text-cream-300">Đạt tiêu chuẩn VSATTP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-800 text-accent-300">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-cream-300">Miễn phí đơn trên 2 triệu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <span className="font-serif text-xl font-bold">Y</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Yến Sào</h3>
                <p className="text-[10px] text-accent-300 tracking-widest uppercase">Khánh Hòa</p>
              </div>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">
              Chuyên cung cấp yến sào cao cấp 100% tự nhiên từ các hang yến nổi tiếng tại Khánh Hòa.
              Cam kết chất lượng, uy tín lâu năm.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-cream-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent-300 flex-shrink-0" />
                <span>123 Nguyễn Huệ, Nha Trang, Khánh Hòa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-300 flex-shrink-0" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-300 flex-shrink-0" />
                <span>info@yensao.vn</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Danh Mục</h4>
            <ul className="space-y-2 text-sm text-cream-300">
              <li>
                <button onClick={() => navigate({ name: 'products' })} className="hover:text-accent-300 transition-colors">
                  Tất Cả Sản Phẩm
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', categorySlug: 'yen-sao-tinh-che' })} className="hover:text-accent-300 transition-colors">
                  Yến Tinh Chế
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', categorySlug: 'yen-sao-hu-chung' })} className="hover:text-accent-300 transition-colors">
                  Hũ Yến Chưng
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', categorySlug: 'set-qua-yen-sao' })} className="hover:text-accent-300 transition-colors">
                  Set Quà Yến Sào
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Về Chúng Tôi</h4>
            <ul className="space-y-2 text-sm text-cream-300">
              <li>
                <button onClick={() => navigate({ name: 'about' })} className="hover:text-accent-300 transition-colors">
                  Giới Thiệu
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'contact' })} className="hover:text-accent-300 transition-colors">
                  Liên Hệ
                </button>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-800 hover:bg-primary-700 text-cream-200 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="container-max px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-cream-400">
            © 2026 Yến Sào Khánh Hòa. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
