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

  const featuredCategories = categories.slice(0, 3);
  const moreCategories = categories.slice(3);
  const navLinks: { label: string; page: Page }[] = [
    { label: 'Trang Chủ', page: { name: 'home' } },
    ...featuredCategories.map((cat) => ({ label: cat.name, page: { name: 'products' as const, categorySlug: cat.slug } })),
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
      <div className="bg-[#0A3125] text-white text-xs">
        <div className="container-max flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="hidden sm:block">
            Miễn phí giao hàng cho đơn hàng trên 2.000.000đ
          </p>
          <div className="flex items-center gap-4">
            <a href="tel:1900xxxx" className="text-white hover:text-[#D4AA76] transition-colors">
              Hotline: 1900 xxxx
            </a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">100% Yến Sào Tự Nhiên</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F4]/95 text-[#493729] backdrop-blur-md border-b border-[#EAE4D7] shadow-sm">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px]">
            {/* Logo */}
            <button
              onClick={() => handleNav({ name: 'home' })}
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[#D9BD8C] to-[#A37944] text-white shadow-sm group-hover:shadow-md transition-shadow">
                <span className="font-serif text-xl font-bold">Y</span>
              </div>
              <div className="text-left">
                <h1 className="font-serif text-[24px] font-bold text-[#493729] leading-none">
                  Yến Sào
                </h1>
                <p className="text-[10px] text-[#A37944] tracking-[0.18em] font-medium uppercase mt-1">
                  Khánh Hòa
                </p>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.label === 'Sản Phẩm' && setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                >
                  <button
                    onClick={() => handleNav(link.page)}
                    className={`relative px-3 py-3 text-[13px] font-medium uppercase tracking-[0.045em] rounded-none border-b-2 transition-all duration-200 flex items-center gap-1 ${
                      isActive(link.page)
                        ? 'text-[#A37944] border-[#A37944]'
                         : 'text-[#493729] border-transparent hover:text-[#A37944] hover:border-[#D9BD8C]'
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
                      <div className="bg-white rounded-xl shadow-xl ring-1 ring-[#EAE4D7] overflow-hidden">
                        <button
                          onClick={() => handleNav({ name: 'products' })}
                          className="block w-full text-left px-4 py-3 text-[13px] font-semibold text-[#493729] hover:bg-[#F8F5ED] hover:text-[#A37944] border-b border-[#F0EBE2]"
                        >
                          Tất Cả Sản Phẩm
                        </button>
                        {moreCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleNav({ name: 'products', categorySlug: cat.slug })}
                            className="block w-full text-left px-4 py-3 text-[13px] text-[#65594E] hover:bg-[#F8F5ED] hover:text-[#A37944] transition-colors border-b border-[#F7F4EE] last:border-0"
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
                className="hidden md:flex p-2.5 rounded-lg text-[#493729] hover:bg-[#F3EAD7] hover:text-[#A37944] transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-[#493729] hover:bg-[#F3EAD7] hover:text-[#A37944] transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#D79854] rounded-full ring-2 ring-[#FBF9F4] animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg text-[#493729] hover:bg-[#F3EAD7] transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#EAE4D7] bg-[#FBF9F4] text-[#493729] animate-fade-in">
            <nav className="container-max px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-[13px] font-medium uppercase tracking-[0.035em] transition-colors ${
                      isActive(link.page)
                        ? 'text-[#A37944] bg-[#F3EAD7]'
                         : 'text-[#493729] hover:bg-[#F3EAD7] hover:text-[#A37944]'
                    }`}
                  >
                    {link.label}
                  </button>
                  {link.label === 'Sản Phẩm' && (
                    <div className="ml-4 mt-1 space-y-1">
                      <button
                        onClick={() => handleNav({ name: 'products' })}
                        className="block w-full text-left px-4 py-2 text-[13px] text-[#65594E] hover:bg-[#F3EAD7] hover:text-[#A37944] rounded-lg"
                      >
                        Tất Cả Sản Phẩm
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNav({ name: 'products', categorySlug: cat.slug })}
                          className="block w-full text-left px-4 py-2 text-[13px] text-[#65594E] hover:bg-[#F3EAD7] hover:text-[#A37944] rounded-lg"
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
