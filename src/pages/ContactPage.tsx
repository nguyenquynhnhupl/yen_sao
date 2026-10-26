import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-secondary-900 text-white py-16">
        <div className="container-max px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-accent-300 font-medium uppercase tracking-widest mb-3">
            Liên Hệ
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Kết Nối Với Chúng Tôi
          </h1>
          <p className="text-cream-200 max-w-xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi nào về sản phẩm, đừng ngần ngại liên hệ với chúng tôi.
          </p>
        </div>
      </section>

      <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-secondary-900">
              Thông Tin Liên Hệ
            </h2>
            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Địa chỉ', value: '123 Nguyễn Huệ, Nha Trang, Khánh Hòa' },
                { icon: Phone, title: 'Hotline', value: '1900 xxxx' },
                { icon: Mail, title: 'Email', value: 'info@yensao.vn' },
                { icon: Clock, title: 'Giờ làm việc', value: 'Thứ 2 - Chủ nhật: 8:00 - 20:00' },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white ring-1 ring-cream-200">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary-900">{info.title}</h3>
                    <p className="text-sm text-secondary-600">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden ring-1 ring-cream-200 bg-cream-100 h-64 flex items-center justify-center">
              <div className="text-center text-secondary-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Bản đồ Google Maps</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="card p-6 lg:p-8">
            <h2 className="font-serif text-2xl font-bold text-secondary-900 mb-4">
              Gửi Tin Nhắn
            </h2>
            <p className="text-sm text-secondary-600 mb-6">
              Điền form dưới đây, chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </p>

            {submitted && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-success-50 text-success-700 mb-4 animate-fade-in">
                <Check className="w-5 h-5" />
                <p className="text-sm font-medium">Tin nhắn của bạn đã được gửi thành công!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Họ và tên <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Số điện thoại <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="0901 234 567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Nội dung <span className="text-error-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Nội dung tin nhắn..."
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send className="w-4 h-4" />
                Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
