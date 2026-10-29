import { useState } from 'react';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Award,
  Check,
  ArrowLeft,
  Star,
  Gift,
  X,
} from 'lucide-react';
import { useProduct, useProducts } from '@/lib/hooks';
import { useCart } from '@/context/CartContext';
import type { Page } from '@/lib/types';
import { formatVND } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  navigate: (page: Page) => void;
}

export default function ProductDetailPage({ slug, navigate }: ProductDetailPageProps) {
  const { product, loading } = useProduct(slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'usage' | 'reviews'>('description');
  const [zoomOpen, setZoomOpen] = useState(false);

  const { products: related } = useProducts({ limit: 4 });

  if (loading) {
    return (
      <div className="container-max px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-cream-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-200 rounded animate-pulse" />
            <div className="h-6 bg-cream-200 rounded w-2/3 animate-pulse" />
            <div className="h-32 bg-cream-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-max px-4 py-20 text-center animate-fade-in">
        <h1 className="font-serif text-2xl font-bold text-secondary-900 mb-4">
          Không tìm thấy sản phẩm
        </h1>
        <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
          Quay Lại Sản Phẩm
        </button>
      </div>
    );
  }

  const galleryImages = Array.from(new Set([
    product.image_url,
    ...(product.detail_content ?? []).filter((block) => block.type === 'image').map((block) => block.content),
    ...((product as any).gallery_images ?? (product as any).images ?? (product as any).image_urls ?? []),
  ].filter((url): url is string => Boolean(url?.trim()))));
  const activeImage = selectedImage && galleryImages.includes(selectedImage) ? selectedImage : (galleryImages[0] ?? '');

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate({ name: 'checkout' });
  };

  return (
    <div className="animate-fade-in min-h-screen bg-[#fbf8f2]">
      {/* Breadcrumb */}
      <div className="bg-cream-100 border-b border-cream-200">
        <div className="container-max px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-secondary-500">
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary-600 transition-colors">
              Trang Chủ
            </button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate({ name: 'products' })} className="hover:text-primary-600 transition-colors">
              Sản Phẩm
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-700 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          {/* Product image gallery */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative overflow-hidden rounded-3xl border border-[#e9dfd0] bg-gradient-to-br from-white via-[#fffdf9] to-[#f4ecdf] p-3 shadow-[0_18px_48px_rgba(74,52,25,0.10)] sm:p-5">
              <button type="button" onClick={() => activeImage && setZoomOpen(true)} aria-label="Phóng to ảnh sản phẩm" className="group flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-[#f8f3e9] p-3 cursor-zoom-in sm:p-5">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(55,42,24,0.10)] transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="text-sm text-[#9b8b75]">Chưa có hình ảnh sản phẩm</div>
                )}
              </button>
              {discount > 0 && (
                <span className="absolute left-6 top-6 rounded-full bg-[#8b3d2e] px-3.5 py-2 text-xs font-bold tracking-wide text-white shadow-md">
                  -{discount}%
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Ảnh sản phẩm">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                    aria-pressed={activeImage === image}
                    className={`h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1.5 transition sm:h-[88px] sm:w-[88px] ${activeImage === image ? 'border-[#a1814e] shadow-sm' : 'border-[#eee4d6] hover:border-[#cbb58f]'}`}
                  >
                    <img src={image} alt={`${product.name} - ảnh ${index + 1}`} loading="lazy" className="h-full w-full rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.is_bestseller && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f0e4] px-3 py-1.5 text-xs font-bold tracking-wide text-[#8a6b3f]">
                <Check className="w-3 h-3" />
                Bestseller
              </span>
            )}

            <h1 className="font-serif text-2xl font-bold leading-tight text-[#332719] sm:text-3xl lg:text-[2.15rem]">
              {product.name}
            </h1>


            <div className="flex flex-wrap items-center gap-2 text-sm text-[#85745e]">
              <span className="flex items-center gap-0.5 text-[#c2933d]">{[1,2,3,4,5].map(n => <Star key={n} className="h-4 w-4" fill="currentColor" />)}</span>
              <span className="text-xs">Đánh giá khách hàng</span>
              {typeof product.sold_count === 'number' && <><span className="text-[#d8cbb8]">|</span><span className="text-xs">Đã bán: {product.sold_count}</span></>}
              {product.weight && <><span className="text-[#d8cbb8]">|</span><span className="text-xs">Khối lượng: {product.weight}</span></>}
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1 border-y border-[#eee4d6] py-4">
              <p className="font-serif text-3xl font-bold tracking-tight text-[#315c46] sm:text-4xl">
                {formatVND(product.price)}
              </p>
              {product.compare_price && (
                <p className="mb-1 text-base text-[#a69a88] line-through">
                  {formatVND(product.compare_price)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#edf5ed] px-3 py-1.5 text-xs font-semibold text-[#3f7548]">
                    <Check className="w-4 h-4" />
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                </>
              ) : (
                <span className="text-error-500 font-medium">Hết hàng</span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-secondary-700">Số lượng:</span>
              <div className="flex items-center gap-1 rounded-full border border-[#e9dfd0] bg-[#fcfaf6] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full p-2 text-[#6d5a43] transition hover:bg-white"
                  aria-label="Giảm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-semibold text-[#332719]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-md text-secondary-600 hover:bg-white transition-colors"
                  aria-label="Tăng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#eadcc4] bg-[#fffaf1] p-3.5 text-sm text-[#765b35]"><Gift className="mt-0.5 h-5 w-5 shrink-0 text-[#b48a45]" /><div><p className="font-semibold">Ưu đãi dành riêng cho bạn</p><p className="mt-0.5 text-xs leading-relaxed">Liên hệ cửa hàng để biết quà tặng và chương trình áp dụng cho sản phẩm này.</p></div></div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-outline flex-1 !rounded-full !py-3.5"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã Thêm Vào Giỏ
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Thêm Vào Giỏ
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="btn-primary flex-1 !rounded-full !py-3.5"
              >
                Mua Ngay
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-[#eee4d6] pt-5">
              {[
                { icon: ShieldCheck, label: '100% Tự Nhiên' },
                { icon: Award, label: 'Chứng Nhận CL' },
                { icon: Truck, label: 'Giao Hàng Toàn Quốc' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-[#fbf7ef] px-2 py-3 text-center">
                  <badge.icon className="h-5 w-5 text-[#a1814e]" />
                  <span className="text-[10px] font-semibold leading-snug text-[#6b5a43] sm:text-xs">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product information tabs */}
        <div className="mt-12">
          <nav aria-label="Thông tin sản phẩm" className="flex w-full flex-nowrap gap-2 overflow-x-auto border-b border-[#e8ddca] pb-1">
            {([{id:'description',label:'Mô tả chi tiết'},{id:'specs',label:'Thông số kỹ thuật'},{id:'usage',label:'Hướng dẫn sử dụng'},{id:'reviews',label:'Đánh giá'}] as const).map(tab => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-current={activeTab===tab.id?'page':undefined} className={`shrink-0 rounded-t-xl border border-b-0 px-4 py-3 text-sm font-semibold transition sm:px-6 ${activeTab===tab.id?'border-[#e8ddca] bg-[#f8f3e9] text-[#795b30]':'border-transparent bg-transparent text-[#92836d] hover:bg-[#fbf7ef] hover:text-[#795b30]'}`}>{tab.label}</button>)}
          </nav>
          <section className="mt-5 min-h-[220px] px-0 py-6 sm:py-8">
            {activeTab === 'description' && <div className="w-full space-y-5">{product.detail_content?.length ? product.detail_content.map((block,index)=>block.type==='image'?<img key={index} src={block.content} alt={`${product.name} - nội dung ${index + 1}`} loading="lazy" className="mx-auto max-h-[680px] w-full rounded-xl object-contain"/>:<p key={index} className="whitespace-pre-line leading-8 text-[#5f5548]">{block.content}</p>) : product.description ? <p className="whitespace-pre-line leading-8 text-[#5f5548]">{product.description}</p> : product.short_description ? <p className="whitespace-pre-line leading-8 text-[#5f5548]">{product.short_description}</p> : <p className="text-sm text-[#8b7b65]">Thông tin mô tả đang được cập nhật.</p>}</div>}
            {activeTab === 'specs' && <div className="w-full overflow-hidden rounded-xl border border-[#e8ddca] bg-transparent"><table className="w-full table-fixed border-collapse text-left"><tbody>{[...(product.quick_info??[]),...(product.weight?[{label:'Khối lượng',value:product.weight}]:[]),{label:'Tên sản phẩm',value:product.name},{label:'Tình trạng',value:product.stock>0?'Còn hàng':'Tạm hết hàng'}].filter((item,index,all)=>item.label?.trim()&&item.value?.trim()&&all.findIndex(other=>other.label===item.label)===index).map((item,index)=><tr key={index} className="border-b border-[#eee5d8] last:border-b-0"><th scope="row" className="w-[34%] border-r border-[#eee5d8] bg-[#f8f3e9] px-2.5 py-2.5 text-xs font-semibold leading-snug text-[#856640] sm:px-4 sm:py-3 sm:text-sm">{item.label}</th><td className="whitespace-pre-line break-words [overflow-wrap:anywhere] px-2.5 py-2.5 text-xs leading-snug text-[#514638] sm:px-4 sm:py-3 sm:text-sm">{item.value}</td></tr>)}</tbody></table></div>}
            {activeTab === 'usage' && <div className="w-full"><div className="grid gap-4 sm:grid-cols-3">{[{step:'01',title:'Ngâm yến',text:'Ngâm yến trong nước sạch khoảng 30–45 phút hoặc đến khi sợi yến mềm.'},{step:'02',title:'Làm sạch',text:'Kiểm tra và loại bỏ lông hoặc tạp chất còn sót lại nếu có.'},{step:'03',title:'Chưng cách thủy',text:'Chưng khoảng 20–25 phút; có thể thêm đường phèn, táo đỏ tùy khẩu vị.'}].map(item=><div key={item.step} className="rounded-2xl border border-[#eee4d6] bg-[#fdfaf5] p-5"><span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4d1] font-serif text-sm font-bold text-[#8b6b3f]">{item.step}</span><h3 className="mb-2 font-semibold text-[#493a28]">{item.title}</h3><p className="text-sm leading-6 text-[#766957]">{item.text}</p></div>)}</div><p className="mt-4 text-xs leading-5 text-[#8b7b65]">Thời gian ngâm và chưng có thể thay đổi tùy loại yến và hướng dẫn trên bao bì.</p></div>}
            {activeTab === 'reviews' && <div className="w-full"><p className="text-sm leading-7 text-[#766957]">Chưa có đánh giá được hiển thị cho sản phẩm này.</p></div>}
          </section>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl font-bold text-secondary-900 mb-6">
              Sản Phẩm Liên Quan
            </h2>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {related
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-12px)]"><ProductCard product={p} navigate={navigate} /></div>
                ))}
            </div>
          </div>
        )}
      </div>
      {zoomOpen && activeImage && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label="Ảnh sản phẩm phóng to" onClick={() => setZoomOpen(false)}><button type="button" onClick={() => setZoomOpen(false)} aria-label="Đóng ảnh" className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white hover:bg-white/25"><X className="h-6 w-6" /></button><img src={activeImage} alt={product.name} className="max-h-[90vh] max-w-[92vw] object-contain" onClick={(event) => event.stopPropagation()} /></div>}
    </div>
  );
}
