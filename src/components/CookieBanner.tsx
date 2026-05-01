import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    console.log('Cookie consent:', consent);
    if (!consent) {
      setShow(true);
    } else if (consent === 'accepted') {
      updateGoogleAnalyticsConsent(true);
    } else {
      updateGoogleAnalyticsConsent(false);
    }
  }, []);

  const updateGoogleAnalyticsConsent = (accepted: boolean) => {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': accepted ? 'granted' : 'denied'
    });
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    updateGoogleAnalyticsConsent(true);
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    updateGoogleAnalyticsConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-900 text-white p-6 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-serif text-lg mb-2">Paramètres des Cookies</h3>
            <p className="text-sm text-white/80 mb-4">
              Nous utilisons Google Analytics pour améliorer votre expérience. Les cookies analytiques nous aident à comprendre comment vous utilisez notre site.
            </p>
            <p className="text-xs text-white/60">
              <Link to="/privacy" className="text-gold-400 hover:text-gold-300 underline">
                En savoir plus sur notre politique de confidentialité
              </Link>
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/60 hover:text-white flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded font-medium transition-colors"
          >
            Accepter
          </button>
          <button
            onClick={handleReject}
            className="px-6 py-2 border border-white/30 text-white hover:bg-white/10 rounded font-medium transition-colors"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
