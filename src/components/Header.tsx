import { Menu, Search, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/lib/hooks';
import type { Page } from '@/lib/types';

interface HeaderProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export default function Header({ navigate, currentPage }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const { categories } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Trang Chủ', page: { name: 'home' } },
    { label: 'Sản Phẩm', page: { name: 'products' } },
    { label: 'Giới Thiệu', page: { name: 'about' } },
    { label: 'Liên Hệ', page: { name: 'contact' } },
  ];

  const isActive = (p: Page) => {
    if (p.name === currentPage.name) return true;
    if (p.name === 'products' && currentPage.name === 'products') return true;
    if (p.name === 'products' && currentPage.name === 'product') return true;
    return false;
  };

  const handleNav = (p: Page) => {
    navigate(p);
    setMobileOpen(false);
    setCategoryOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-900 text-cream-100 text-xs">
        <div className="container-max flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="hidden sm:block">
            Miễn phí giao hàng cho đơn hàng trên 2.000.000đ
          </p>
          <div className="flex items-center gap-4">
            <a href="tel:1900xxxx" className="hover:text-accent-300 transition-colors">
              Hotline: 1900 xxxx
            </a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">100% Yến Sào Tự Nhiên</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleNav({ name: 'home' })}
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md group-hover:shadow-lg transition-shadow">
                <span className="font-serif text-xl font-bold">Y</span>
              </div>
              <div className="text-left">
                <h1 className="font-serif text-xl font-bold text-primary-800 leading-none">
                  Yến Sào
                </h1>
                <p className="text-[10px] text-secondary-500 tracking-widest uppercase mt-0.5">
                  Khánh Hòa
                </p>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.label === 'Sản Phẩm' && setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                >
                  <button
                    onClick={() => handleNav(link.page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                      isActive(link.page)
                        ? 'text-primary-700 bg-cream-200'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-cream-100'
                    }`}
                  >
                    {link.label}
                    {link.label === 'Sản Phẩm' && (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Category dropdown */}
                  {link.label === 'Sản Phẩm' && categoryOpen && (
                    <div className="absolute top-full left-0 pt-2 w-64 animate-fade-in">
                      <div className="bg-white rounded-xl shadow-xl ring-1 ring-cream-200 overflow-hidden">
                        <button
                          onClick={() => handleNav({ name: 'products' })}
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-primary-700 hover:bg-cream-100 border-b border-cream-100"
                        >
                          Tất Cả Sản Phẩm
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleNav({ name: 'products', categorySlug: cat.slug })}
                            className="block w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-cream-100 hover:text-primary-600 transition-colors border-b border-cream-50 last:border-0"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav({ name: 'products' })}
                className="hidden md:flex p-2.5 rounded-lg text-secondary-600 hover:bg-cream-200 hover:text-primary-600 transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-secondary-600 hover:bg-cream-200 hover:text-primary-600 transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-accent-500 rounded-full ring-2 ring-cream-50 animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg text-secondary-600 hover:bg-cream-200 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-cream-200 bg-cream-50 animate-fade-in">
            <nav className="container-max px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.page)
                        ? 'text-primary-700 bg-cream-200'
                        : 'text-secondary-700 hover:bg-cream-100'
                    }`}
                  >
                    {link.label}
                  </button>
                  {link.label === 'Sản Phẩm' && (
                    <div className="ml-4 mt-1 space-y-1">
                      <button
                        onClick={() => handleNav({ name: 'products' })}
                        className="block w-full text-left px-4 py-2 text-sm text-secondary-600 hover:bg-cream-100 rounded-lg"
                      >
                        Tất Cả Sản Phẩm
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNav({ name: 'products', categorySlug: cat.slug })}
                          className="block w-full text-left px-4 py-2 text-sm text-secondary-600 hover:bg-cream-100 rounded-lg"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
