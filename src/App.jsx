import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

import AgeGate from './components/AgeGate';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import { pageFade } from './components/Motion';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Deals from './pages/Deals';
import MixAndMatch from './pages/MixAndMatch';
import Rewards from './pages/Rewards';
import Faq from './pages/Faq';
import HowToOrder from './pages/HowToOrder';
import OrderTracking from './pages/OrderTracking';
import Shipping from './pages/Shipping';
import Reviews from './pages/Reviews';
import Vendors from './pages/Vendors';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Account from './pages/Account';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

/** /category/:slug is a friendlier alias for /shop?category=:slug. */
function CategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/shop?category=${slug}`} replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageFade}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<CategoryRedirect />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/mix-and-match" element={<MixAndMatch />} />

          {/* Account & checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />

          {/* Support */}
          <Route path="/how-to-order" element={<HowToOrder />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />

          {/* Company */}
          <Route path="/about" element={<About />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Legal */}
          <Route path="/privacy" element={<Legal doc="privacy" />} />
          <Route path="/terms" element={<Legal doc="terms" />} />
          <Route path="/responsible-use" element={<Legal doc="responsible-use" />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // reducedMotion="user" hands control to the OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <CatalogProvider>
        <CartProvider>
          <ScrollToTop />
          <AgeGate />

          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>

          <CartDrawer />
        </CartProvider>
        </CatalogProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
