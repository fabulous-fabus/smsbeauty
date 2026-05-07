import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ChevronUp } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Engagements from './components/Engagements';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import RichSnippets from './components/RichSnippets';
import WhatsAppWidget from './components/WhatsAppWidget';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PhotoUploadPage from './pages/PhotoUploadPage';
import PrivacyPage from './pages/PrivacyPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import PrivateRoute from './components/PrivateRoute';

function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 320;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <RichSnippets type="LocalBusiness" data={{}} />
      <Header />
      <Hero />
      <Services />
      <Engagements />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppWidget />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut"
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/photos"
          element={
            <PrivateRoute>
              <PhotoUploadPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Router>
    </HelmetProvider>
  );
}
