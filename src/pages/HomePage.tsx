import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, Sparkles, Heart, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProducts, useCategories } from '@/lib/hooks';
import type { Page } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface HomePageProps {
  navigate: (page: Page) => void;
}

type HomepageSection = {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  item_type: 'none' | 'category' | 'product';
  item_ids: string[];
  is_active: boolean;
  sort_order: number;
};

const defaultSections: HomepageSection[] = [
  { id: 'hero', section_key: 'hero', title: 'Yến Sào Cao Cấp', subtitle: '100% Yến Sào Tự Nhiên Khánh Hòa', description: 'Bồi Bổ Sức Khỏe. Khám phá bộ sưu tập yến sào tinh chế cao cấp, được khai thác từ các hang yến tự nhiên nổi tiếng tại Khánh Hòa. Cam kết 100% tự nhiên, không pha trộn.', image_url: null, button_text: 'Khám Phá Sản Phẩm', button_url: '/products', item_type: 'none', item_ids: [], is_active: true, sort_order: 3 },
  { id: 'trust_benefits', section_key: 'trust_benefits', title: 'Cam kết chất lượng', subtitle: 'An tâm chọn yến sào tự nhiên', description: '100% Tự Nhiên — Không pha trộn | Chứng Nhận CL — VSATTP đạt chuẩn | Giao Hàng Toàn Quốc — Miễn phí đơn trên 2 triệu | Tư Vấn Chuyên Gia — Hỗ trợ 24/7', image_url: null, button_text: null, button_url: null, item_type: 'none', item_ids: [], is_active: true, sort_order: 4 },
  { id: 'categories', section_key: 'categories', title: 'Bộ Sưu Tập Yến Sào', subtitle: 'Danh Mục', description: 'Khám phá các dòng sản phẩm yến sào.', image_url: null, button_text: null, button_url: '/products', item_type: 'category', item_ids: [], is_active: true, sort_order: 5 },
  { id: 'featured_products', section_key: 'featured_products', title: 'Sản Phẩm Nổi Bật', subtitle: 'Nổi Bật', description: 'Những sản phẩm được tuyển chọn dành cho bạn.', image_url: null, button_text: 'Xem Tất Cả', button_url: '/products', item_type: 'product', item_ids: [], is_active: true, sort_order: 6 },
  { id: 'gift_banner', section_key: 'gift_banner', title: 'Set Quà Yến Sào Sang Trọng & Ý Nghĩa', subtitle: 'Quà Tặng Cao Cấp', description: 'Tặng yến sào là tặng sức khỏe và sự sang trọng. Set quà yến sào được đóng gói trong hộp gỗ cao cấp, kèm giấy chứng nhận chất lượng. Lý tưởng để biếu sếp, đối tác và người thân trong các dịp lễ Tết.', image_url: null, button_text: 'Xem Set Quà', button_url: '/products', item_type: 'none', item_ids: [], is_active: true, sort_order: 7 },
  { id: 'best_sellers', section_key: 'best_sellers', title: 'Sản Phẩm Bán Chạy Nhất', subtitle: 'Bán Chạy', description: 'Các sản phẩm được khách hàng yêu thích.', image_url: null, button_text: 'Xem Tất Cả', button_url: '/products', item_type: 'product', item_ids: [], is_active: true, sort_order: 8 },
  { id: 'benefits_stats', section_key: 'benefits_stats', title: 'Lợi ích yến sào', subtitle: '50+', description: 'Axit amin thiết yếu', image_url: null, button_text: null, button_url: null, item_type: 'none', item_ids: [], is_active: true, sort_order: 9 },
];

function splitDescription(value: string | null | undefined) {
  return (value ?? '').split('|').map((item) => item.trim()).filter(Boolean);
}

function sectionButtonTarget(url: string | null | undefined): Page {
  if (!url || url === '/' || url === '/products') return { name: 'products' };
  if (url.startsWith('/products/')) return { name: 'products', categorySlug: url.slice('/products/'.length) };
  if (url === '/about') return { name: 'about' };
  if (url === '/contact') return { name: 'contact' };
  return { name: 'products' };
}

export default function HomePage({ navigate }: HomePageProps) {
  const { products: allProducts, loading: productsLoading } = useProducts({ limit: 100 });
  const { categories } = useCategories();
  const [sections, setSections] = useState<HomepageSection[]>(defaultSections);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('homepage_sections')
      .select('id, section_key, title, subtitle, description, image_url, button_text, button_url, item_type, item_ids, is_active, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Failed to load homepage sections; using defaults:', error.message);
          return;
        }
        if (data?.length) {
          setSections(data.map((row: any) => ({
            ...row,
            item_ids: Array.isArray(row.item_ids) ? row.item_ids : [],
          })) as HomepageSection[]);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const sectionByKey = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.section_key, section])) as Record<string, HomepageSection | undefined>,
    [sections],
  );

  const visibleSections = sections.filter((section) => section.is_active);
  const productsFor = (sectionKey: string, fallbackLimit: number) => {
    const section = sectionByKey[sectionKey];
    // Only show products explicitly selected in Admin > Homepage.
    // An empty selection must not fall back to every Master Data product.
    const chosenIds = section?.item_ids ?? [];
    if (chosenIds.length === 0) return [];
    return allProducts
      .filter((product) => chosenIds.includes(product.id))
      .slice(0, fallbackLimit);
  };

  const renderSection = (section: HomepageSection) => {
    switch (section.section_key) {
      
      case 'hero':
        return (
          <section
            key={section.id}
            className="relative overflow-hidden bg-secondary-900 text-white"
          >
            <div className="absolute inset-0">
              <img
                src={section.image_url || 'https://images.pexels.com/photos/16337380/pexels-photo-16337380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071D17]/85 via-[#071D17]/55 to-[#071D17]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D17]/35 via-transparent to-black/10" />
            </div>

            <div className="container-max relative px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
              <div className="max-w-2xl space-y-6 animate-fade-in-up">
                {section.subtitle && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E5C58F]/70 bg-[#102D23]/75 px-4 py-2 text-xs font-semibold tracking-wide text-[#F4D9A6] shadow-[0_4px_18px_rgba(0,0,0,0.18)] backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-accent-300" />
                    {section.subtitle}
                  </div>
                )}

                <h1 className="font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-[#FFF8E9] drop-shadow-[0_3px_18px_rgba(0,0,0,0.38)] sm:text-5xl lg:text-7xl">
                  {section.title}
                </h1>

                {section.description && (
                  <p className="max-w-lg text-base leading-relaxed text-[#F4F0E6] drop-shadow-sm sm:text-lg">
                    {section.description}
                  </p>
                )}

                {section.button_text && (
                  <button
                    onClick={() => navigate(sectionButtonTarget(section.button_url))}
                    className="group inline-flex items-center gap-3 rounded-xl border border-[#F0D7A6]/70 bg-[linear-gradient(135deg,#E8C98D_0%,#C29B63_55%,#A8794A_100%)] px-7 py-4 text-sm font-bold tracking-wide text-[#1A1108] shadow-[0_8px_24px_rgba(194,155,99,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(194,155,99,0.42)] active:translate-y-0
                  >
                    {section.button_text}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </section>
        );

      case 'trust_benefits': {
        const benefits = splitDescription(section.description);
        const icons = [ShieldCheck, Award, Truck, Heart];
        return <section key={section.id} className="bg-white border-b border-[#EAEAEA]"><div className="container-max px-4 py-6 sm:px-6 lg:px-8">{section.title && <h2 className="sr-only">{section.title}</h2>}{section.subtitle && <p className="text-center text-sm text-secondary-500 mb-4">{section.subtitle}</p>}<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{benefits.map((benefit, i) => { const [title, desc] = benefit.split('—').map((s) => s.trim()); const Icon = icons[i % icons.length]; return <div key={benefit} className="flex items-center gap-3"><div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#EAEAEA] text-[#333333] flex-shrink-0"><Icon className="w-5 h-5" /></div><div><h3 className="text-sm font-semibold text-[#222222]">{title}</h3><p className="text-xs text-[#666666]">{desc || ''}</p></div></div>; })}</div></div></section>;
      }
      case 'categories':
        return <section key={section.id} className="section-padding bg-[#F8F5ED]"><div className="container-max"><div className="text-center mb-10">{section.subtitle && <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">{section.subtitle}</p>}<h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">{section.title}</h2>{section.description && <p className="mt-3 text-secondary-600">{section.description}</p>}</div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{categories.filter((cat) => section.item_ids.includes(cat.id)).map((cat) => <button key={cat.id} onClick={() => navigate({ name: 'products', categorySlug: cat.slug })} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-cream-200 p-6 text-center ring-1 ring-cream-200 hover:ring-primary-300 transition-all hover:shadow-lg"><div className="absolute inset-0 bg-gradient-to-t from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/10 transition-all" /><div className="relative"><div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-primary-600 group-hover:scale-110 transition-all"><Sparkles className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" /></div><h3 className="font-serif text-sm font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors leading-snug">{cat.name}</h3></div></button>)}</div></div></section>;
      case 'featured_products':
      case 'best_sellers': {
        const list = productsFor(section.section_key, section.section_key === 'featured_products' ? 8 : 4);
        const loading = productsLoading;
        return <section key={section.id} className={section.section_key === 'featured_products' ? 'bg-[#EDE5D6] section-padding' : 'bg-white section-padding'}><div className="container-max"><div className={section.section_key === 'featured_products' ? 'flex items-end justify-between mb-8' : 'text-center mb-10'}><div>{section.subtitle && <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">{section.subtitle}</p>}<h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">{section.title}</h2>{section.description && <p className="mt-3 text-secondary-600">{section.description}</p>}</div>{section.button_text && <button onClick={() => navigate(sectionButtonTarget(section.button_url))} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">{section.button_text}<ArrowRight className="w-4 h-4" /></button>}</div>{loading ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="card p-4 space-y-3"><div className="aspect-[4/3] rounded-xl bg-cream-200 animate-pulse" /><div className="h-4 bg-cream-200 rounded animate-pulse" /></div>)}</div> : <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{list.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}</div>}</div></section>;
      }
      case 'gift_banner':
        return (
          <section key={section.id} className="relative overflow-hidden bg-[linear-gradient(135deg,#0A3125_0%,#06241B_100%)] text-white">
            {/* Subtle luxury background decoration */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#D4AA76]/15" />
              <div className="absolute -right-10 -top-14 h-60 w-60 rounded-full border border-[#D4AA76]/10" />
              <Sparkles className="absolute left-[5%] top-10 h-7 w-7 text-[#D4AA76]/20" />
              <Star className="absolute right-[8%] bottom-10 h-6 w-6 text-[#D4AA76]/20" />
            </div>

            <div className="container-max relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
              <div className="relative overflow-hidden rounded-[24px] border border-[#D4AA76]/30 bg-white/[0.02] p-4 sm:p-6 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-[45fr_55fr] lg:gap-10">
                  {section.image_url && (
                    <div className="relative order-1 lg:order-2">
                      <div className="absolute -inset-3 rounded-[24px] border border-[#D4AA76]/20" aria-hidden="true" />
                      <div className="relative overflow-hidden rounded-[20px] border border-[#D4AA76]/50 bg-[#06241B] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        <img
                          src={section.image_url}
                          alt={section.title}
                          className="aspect-[4/3] w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <Star className="absolute -right-3 -top-3 h-8 w-8 fill-[#D4AA76] text-[#D4AA76] drop-shadow-lg" aria-hidden="true" />
                    </div>
                  )}

                  <div className={section.image_url ? 'order-2 space-y-5 lg:order-1' : 'space-y-5'}>
                    {section.subtitle && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#F0D7A6] bg-[#244637]/90 px-4 py-2 text-sm font-semibold text-[#FFE8B8] shadow-[0_4px_18px_rgba(0,0,0,0.2)] backdrop-blur-md">
                        <Star className="h-4 w-4 fill-[#E5C58F] text-[#E5C58F]" />
                        {section.subtitle}
                      </div>
                    )}

                    <h2 className="font-serif text-[28px] font-bold leading-tight sm:text-4xl lg:text-[44px]">
                      {section.title.includes('Sang Trọng') ? (
                        <>
                          <span className="text-[#FFF8E9]">Set Quà Yến Sào</span>
                          <span className="block bg-gradient-to-r from-[#F2D7A0] via-[#E5C58F] to-[#D4AA76] bg-clip-text text-transparent">Sang Trọng &amp; Ý Nghĩa</span>
                        </>
                      ) : section.title}
                    </h2>

                    {section.description && (
                      <p className="max-w-xl text-base leading-relaxed text-[#D1D5DB]">
                        {section.description}
                      </p>
                    )}

                    {section.button_text && (
                      <button
                        onClick={() => navigate(sectionButtonTarget(section.button_url))}
                        className="group inline-flex items-center gap-2 rounded-xl border border-[#F6DDAA] bg-[linear-gradient(135deg,#F2D7A0_0%,#D6AE70_48%,#BD8D53_100%)] px-7 py-3.5 text-sm font-extrabold text-[#1A1108] shadow-[0_6px_20px_rgba(242,215,160,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_30px_rgba(242,215,160,0.48)] active:translate-y-0"
                      >
                        {section.button_text}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'benefits_stats': {
        let benefitItems: Array<{ id?: string; icon?: string; title?: string; description?: string }> = [];
        try {
          const parsed = JSON.parse(section.description || '');
          if (Array.isArray(parsed)) benefitItems = parsed;
        } catch { /* Backward-compatible with the old plain-text description. */ }
        const iconFor = (name?: string) => {
          const candidate = name ? (LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>)[name] : undefined;
          return candidate || Sparkles;
        };
        return <section key={section.id} className="bg-[#F4F0E6] section-padding"><div className="container-max"><div className={section.image_url ? 'grid lg:grid-cols-2 gap-10 items-center' : 'max-w-5xl mx-auto'}>{section.image_url && <div><img src={section.image_url} alt={section.title} className="rounded-2xl shadow-xl w-full object-cover" /></div>}<div className="space-y-5"><p className="text-sm text-primary-600 font-medium uppercase tracking-widest">{section.subtitle || 'Công Dụng'}</p><h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900 leading-tight">{section.title}</h2>{benefitItems.length > 0 ? <div className="grid sm:grid-cols-2 gap-4 pt-2">{benefitItems.map((item, index) => { const Icon = iconFor(item.icon); return <article key={item.id || index} className="rounded-2xl bg-white/80 border border-cream-200 p-5 shadow-sm"><div className="flex items-center gap-3 mb-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"><Icon className="h-5 w-5" /></span><h3 className="font-semibold text-secondary-900">{item.title}</h3></div>{item.description && <p className="text-sm leading-relaxed text-secondary-600">{item.description}</p>}</article>; })}</div> : section.description && <p className="text-secondary-600 leading-relaxed">{section.description}</p>}</div></div></div></section>;
      }
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {visibleSections.filter((section) => section.section_key === 'hero').map(renderSection)}
      {visibleSections.filter((section) => section.section_key !== 'hero').map(renderSection)}
    </div>
  );
}
