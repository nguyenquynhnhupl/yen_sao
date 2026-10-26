import { CartProvider } from '@/context/CartContext';
import { useNavigation } from '@/lib/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

function AppContent() {
  const { page, navigate } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header navigate={navigate} currentPage={page} />

      <main className="flex-1">
        {page.name === 'home' && <HomePage navigate={navigate} />}

        {page.name === 'products' && (
          <ProductsPage navigate={navigate} categorySlug={page.categorySlug} />
        )}

        {page.name === 'product' && (
          <ProductDetailPage slug={page.slug} navigate={navigate} />
        )}

        {page.name === 'cart' && <CartPage navigate={navigate} />}

        {page.name === 'checkout' && <CheckoutPage navigate={navigate} />}

        {page.name === 'order-success' && (
          <OrderSuccessPage orderNumber={page.orderNumber} navigate={navigate} />
        )}

        {page.name === 'about' && <AboutPage navigate={navigate} />}

        {page.name === 'contact' && <ContactPage />}
      </main>

      <Footer navigate={navigate} />
      <CartDrawer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
