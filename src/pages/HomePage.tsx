import { ArrowRight, ShieldCheck, Award, Truck, Sparkles, Heart, Star } from 'lucide-react';
import { useProducts, useCategories } from '@/lib/hooks';
import type { Page } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface HomePageProps {
  navigate: (page: Page) => void;
}

export default function HomePage({ navigate }: HomePageProps) {
  const { products: featured, loading: featLoading } = useProducts({ featured: true, limit: 8 });
  const { products: bestsellers, loading: bsLoading } = useProducts({ bestseller: true, limit: 4 });
  const { categories } = useCategories();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/16337380/pexels-photo-16337380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 to-transparent" />
        <div className="container-max relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium ring-1 ring-white/20">
              <Sparkles className="w-3.5 h-3.5 text-accent-300" />
              100% Yến Sào Tự Nhiên Khánh Hòa
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Yến Sào Cao Cấp
              <span className="block text-accent-300">Bồi Bổ Sức Khỏe</span>
            </h1>
            <p className="text-lg text-cream-200 leading-relaxed max-w-lg">
              Khám phá bộ sưu tập yến sào tinh chế cao cấp, được khai thác từ các hang yến
              tự nhiên nổi tiếng tại Khánh Hòa. Cam kết 100% tự nhiên, không pha trộn.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate({ name: 'products' })}
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-sm font-semibold text-primary-950 hover:bg-accent-400 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                Khám Phá Sản Phẩm
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate({ name: 'about' })}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                Về Chúng Tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-cream-200">
        <div className="container-max px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: '100% Tự Nhiên', desc: 'Không pha trộn' },
              { icon: Award, title: 'Chứng Nhận CL', desc: 'VSATTP đạt chuẩn' },
              { icon: Truck, title: 'Giao Hàng Toàn Quốc', desc: 'Miễn phí > 2 triệu' },
              { icon: Heart, title: 'Tư Vấn Chuyên Gia', desc: 'Hỗ trợ 24/7' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900">{f.title}</h3>
                  <p className="text-xs text-secondary-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">
              Danh Mục
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">
              Bộ Sưu Tập Yến Sào
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate({ name: 'products', categorySlug: cat.slug })}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-cream-200 p-6 text-center ring-1 ring-cream-200 hover:ring-primary-300 transition-all hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/10 transition-all" />
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-primary-600 group-hover:scale-110 transition-all">
                    <Sparkles className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream-100 section-padding">
        <div className="container-max">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">
                Nổi Bật
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">
                Sản Phẩm Nổi Bật
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'products' })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Xem Tất Cả
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {featLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 space-y-3">
                  <div className="aspect-[4/3] rounded-xl bg-cream-200 animate-pulse" />
                  <div className="h-4 bg-cream-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-cream-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div className="container-max px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/20">
                <Star className="w-3.5 h-3.5 text-accent-300 fill-accent-300" />
                Quà Tặng Cao Cấp
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Set Quà Yến Sào
                <span className="block text-accent-300">Sang Trọng & Ý Nghĩa</span>
              </h2>
              <p className="text-cream-200 leading-relaxed">
                Tặng yến sào là tặng sức khỏe và sự sang trọng. Set quà yến sào của chúng tôi
                được đóng gói trong hộp gỗ cao cấp, kèm giấy chứng nhận chất lượng. Lý tưởng
                cho biếu sếp, đối tác, người thân trong các dịp lễ Tết.
              </p>
              <button
                onClick={() => navigate({ name: 'products', categorySlug: 'set-qua-yen-sao' })}
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-sm font-semibold text-primary-950 hover:bg-accent-400 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                Xem Set Quà
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/13787562/pexels-photo-13787562.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Set quà yến sào"
                className="rounded-2xl shadow-2xl ring-4 ring-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">
              Bán Chạy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">
              Sản Phẩm Bán Chạy Nhất
            </h2>
          </div>

          {bsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 space-y-3">
                  <div className="aspect-[4/3] rounded-xl bg-cream-200 animate-pulse" />
                  <div className="h-4 bg-cream-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits section */}
      <section className="bg-gradient-to-br from-primary-50 to-cream-200 section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/8076212/pexels-photo-8076212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Lợi ích yến sào"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 ring-1 ring-cream-200 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-bold text-primary-700">50+</p>
                    <p className="text-xs text-secondary-500">Axit amin thiết yếu</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5 order-1 lg:order-2">
              <p className="text-sm text-primary-600 font-medium uppercase tracking-widest">
                Công Dụng
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900 leading-tight">
                Yến Sào - Thực Phẩm Vàng Cho Sức Khỏe
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Tăng cường miễn dịch', desc: 'Giàu protein và 18 axit amin giúp tăng sức đề kháng' },
                  { title: 'Làm đẹp da', desc: 'Chứa EGFP giúp tái tạo tế bào, trẻ hóa làn da' },
                  { title: 'Bồi bổ cho người già & trẻ em', desc: 'Dễ hấp thụ, hỗ trợ phục hồi sức khỏe' },
                  { title: 'Tốt cho phụ nữ mang thai', desc: 'Cung cấp dinh dưỡng cho mẹ và thai nhi' },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white flex-shrink-0 mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">{benefit.title}</h3>
                      <p className="text-sm text-secondary-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
