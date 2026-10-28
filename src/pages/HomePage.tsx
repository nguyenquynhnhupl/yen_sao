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
                className="w-full h-full object-cover"
              />
            </div>

            <div className="container-max relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
              <div className="max-w-2xl space-y-6 animate-fade-in-up">
                {section.subtitle && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#D79854] px-4 py-1.5 text-xs font-semibold text-white shadow-sm ring-1 ring-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-accent-300" />
                    {section.subtitle}
                  </div>
                )}

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {section.title}
                </h1>

                {section.description && (
                  <p className="text-lg text-cream-200 leading-relaxed max-w-lg">
                    {section.description}
                  </p>
                )}

                {section.button_text && (
                  <button
                    onClick={() => navigate(sectionButtonTarget(section.button_url))}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#D4AA76] px-7 py-3.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#E2BC8D] transition-all hover:shadow-xl active:scale-[0.98]"
                  >
                    {section.button_text}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>
        );

      case 'trust_benefits': {
        const benefits = splitDescription(section.description);
        const icons = [ShieldCheck, Award, Truck, Heart];
        return <section key={section.id} className="bg-white border-b border-[#EAEAEA]"><div className="container-max px-4 py-6 sm:px-6 lg:px-8">{section.title && <h2 className="sr-only">{section.title}</h2>}{section.subtitle && <p className="text-center text-sm text-secondary-500 mb-4">{section.subtitle}</p>}<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{benefits.map((benefit, i) => { const [title, desc] = benefit.split('—').map((s) => s.trim()); const Icon = icons[i % icons.length]; return <div key={benefit} className="flex items-center gap-3"><div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#EAEAEA] text-[#333333] flex-shrink-0"><Icon className="w-5 h-5" /></div><div><h3 className="text-sm font-semibold text-[#333333]">{title}</h3><p className="text-xs text-[#666666]">{desc || ''}</p></div></div>; })}</div></div></section>;
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
        return <section key={section.id} className="relative overflow-hidden bg-primary-900 text-white"><div className="container-max px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="grid lg:grid-cols-2 gap-8 items-center"><div className="space-y-5">{section.subtitle && <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/20"><Star className="w-3.5 h-3.5 text-accent-300 fill-accent-300" />{section.subtitle}</div>}<h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">{section.title}</h2>{section.description && <p className="text-cream-200 leading-relaxed">{section.description}</p>}{section.button_text && <button onClick={() => navigate(sectionButtonTarget(section.button_url))} className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-sm font-semibold text-primary-950 hover:bg-accent-400 transition-all hover:shadow-xl active:scale-[0.98]">{section.button_text}<ArrowRight className="w-4 h-4" /></button>}</div>{section.image_url && <div className="relative"><img src={section.image_url} alt={section.title} className="rounded-2xl shadow-2xl ring-4 ring-white/10" /></div>}</div></div></section>;
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
