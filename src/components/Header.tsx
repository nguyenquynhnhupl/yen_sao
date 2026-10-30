import { Menu, Search, ShoppingCart, X } from 'lucide-react';
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
  const [searchText, setSearchText] = useState('');

  const featuredCategories = categories.slice(0, 3);
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
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNav({ name: 'products', searchQuery: searchText.trim() });
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
      <header className="sticky top-0 z-40 bg-[#0A3125]/95 text-white backdrop-blur-md border-b border-white/10 shadow-sm">
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
                <h1 className="font-serif !text-[22px] font-semibold text-white leading-none tracking-tight">
                  Yến Sào
                </h1>
                <p className="text-[10px] text-white/70 tracking-[0.16em] font-medium uppercase mt-0.5">
                  Khánh Hòa
                </p>
              </div>
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} role="search" className="mx-4 hidden max-w-2xl flex-1 md:flex">
              <div className="flex w-full items-center rounded-full border border-white/25 bg-white px-4 py-2.5 text-[#493729] shadow-inner transition focus-within:border-[#D4AA76] focus-within:ring-2 focus-within:ring-[#D4AA76]/25">
                <Search className="mr-2 h-5 w-5 shrink-0 text-[#8A765D]" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Tìm kiếm sản phẩm yến sào..."
                  aria-label="Tìm kiếm sản phẩm"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#493729] outline-none placeholder:text-[#9B9082] focus:ring-0"
                />
                <button type="submit" className="ml-2 rounded-full bg-[#D4AA76] px-5 py-2 text-xs font-semibold text-[#17382D] transition hover:bg-[#E4BE8E]">Tìm kiếm</button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-[#493729] hover:bg-[#F3EAD7] hover:text-[#A37944] transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#D79854] rounded-full ring-2 ring-[#0A3125] animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {/* Desktop navigation stays inside the header, below the search row */}
          <nav className="hidden lg:flex items-center justify-center gap-1 border-t border-white/15 py-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.page)}
                className={`rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  isActive(link.page)
                    ? 'bg-white/15 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/15 bg-[#0A3125] text-white animate-fade-in">
            <div className="container-max px-4 pt-4 md:hidden">
              <form onSubmit={handleSearch} role="search" className="flex items-center rounded-full bg-white px-3 py-2 text-[#493729]">
                <Search className="mr-2 h-4 w-4 text-[#8A765D]" />
                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Tìm kiếm sản phẩm..." aria-label="Tìm kiếm sản phẩm" className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none focus:ring-0" />
                <button type="submit" className="ml-2 text-sm font-semibold text-[#8A673E]">Tìm</button>
              </form>
            </div>
            <nav className="container-max px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-[14px] font-medium uppercase tracking-[0.035em] transition-colors ${
                      isActive(link.page)
                        ? 'text-white bg-white/15 ring-1 ring-white/25'
                         : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                  {link.label === 'Sản Phẩm' && (
                    <div className="ml-4 mt-1 space-y-1">
                      <button
                        onClick={() => handleNav({ name: 'products' })}
                        className="block w-full text-left px-4 py-2 text-[13px] text-white/80 hover:bg-white/10 rounded-lg"
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
