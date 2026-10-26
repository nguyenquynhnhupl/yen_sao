import { ShieldCheck, Award, Heart, Leaf, Users, TrendingUp, ArrowRight } from 'lucide-react';
import type { Page } from '@/lib/types';

interface AboutPageProps {
  navigate: (page: Page) => void;
}

export default function AboutPage({ navigate }: AboutPageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/29357406/pexels-photo-29357406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-max relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28 text-center">
          <p className="text-sm text-accent-300 font-medium uppercase tracking-widest mb-3">
            Về Chúng Tôi
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Câu Chuyện Của Yến Sào Khánh Hòa
          </h1>
          <p className="text-lg text-cream-200 max-w-2xl mx-auto leading-relaxed">
            Hơn 15 năm kinh nghiệm trong việc khai thác và cung cấp yến sào cao cấp
            từ những hang yến tự nhiên nổi tiếng nhất Việt Nam.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-max grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl font-bold text-secondary-900">
              Hành Trình Của Chúng Tôi
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              Yến Sào Khánh Hòa được thành lập năm 2010, bắt đầu từ một cơ sở khai thác yến
              nhỏ tại Nha Trang. Với tâm huyết và sự tận tâm, chúng tôi đã phát triển thành
              một trong những thương hiệu yến sào uy tín nhất tại Việt Nam.
            </p>
            <p className="text-secondary-700 leading-relaxed">
              Tất cả sản phẩm yến sào của chúng tôi đều được khai thác từ các hang yến tự nhiên
              tại Khánh Hòa - vùng đất nổi tiếng với chất lượng yến sào tốt nhất. Quy trình
              làm sạch được thực hiện thủ công bởi những người thợ lành nghề, đảm bảo giữ nguyên
              hình dạng và giá trị dinh dưỡng của tổ yến.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/18312782/pexels-photo-18312782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Hang yến tự nhiên"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-100 section-padding">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="text-sm text-primary-600 font-medium uppercase tracking-widest mb-2">
              Giá Trị Cốt Lõi
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-900">
              Cam Kết Của Chúng Tôi
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Tự Nhiên', desc: 'Khai thác từ hang yến tự nhiên, không nuôi nhốt, không pha trộn. Mỗi tổ yến đều được kiểm tra nghiêm ngặt.' },
              { icon: Leaf, title: 'Không Chất Bảo Quản', desc: 'Không sử dụng chất bảo quản, không tẩy trắng hóa học. Sản phẩm an toàn cho sức khỏe người tiêu dùng.' },
              { icon: Award, title: 'Chứng Nhận Chất Lượng', desc: 'Đạt chứng nhận VSATTP của Bộ Y tế. Có giấy chứng nhận xuất xứ và chất lượng cho từng sản phẩm.' },
              { icon: Heart, title: 'Tận Tâm Phục Vụ', desc: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7. Cam kết đổi trả nếu sản phẩm không đúng cam kết.' },
              { icon: Users, title: 'Uy Tín Lâu Năm', desc: 'Hơn 15 năm hoạt động, hàng ngàn khách hàng tin tưởng. Đối tác của nhiều khách sạn, nhà hàng cao cấp.' },
              { icon: TrendingUp, title: 'Phát Triển Bền Vững', desc: 'Khai thác có trách nhiệm, bảo vệ môi trường sống của chim yến. Đóng góp vào cộng đồng địa phương.' },
            ].map((value, i) => (
              <div key={i} className="card p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-secondary-900">{value.title}</h3>
                <p className="text-sm text-secondary-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-900 text-white section-padding">
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { number: '15+', label: 'Năm kinh nghiệm' },
              { number: '10,000+', label: 'Khách hàng tin tưởng' },
              { number: '50+', label: 'Sản phẩm đa dạng' },
              { number: '100%', label: 'Tự nhiên' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="font-serif text-4xl font-bold text-accent-300">{stat.number}</p>
                <p className="text-sm text-cream-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container-max max-w-2xl space-y-5">
          <h2 className="font-serif text-3xl font-bold text-secondary-900">
            Trải Nghiệm Yến Sào Cao Cấp
          </h2>
          <p className="text-secondary-600">
            Khám phá bộ sưu tập yến sào đa dạng của chúng tôi, từ yến tinh chế đến set quà sang trọng.
          </p>
          <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
            Xem Sản Phẩm
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
