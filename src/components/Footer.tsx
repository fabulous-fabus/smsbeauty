import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Services', href: '#services' },
  { label: 'À Propos', href: '#apropos' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Contact', href: '#contact' },
];

const services = [
  'Traiteur oriental',
  'Location de robes',
  'Vente de robes',
  'Décoration événementielle',
  'Forfait mariage complet',
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal-900 text-white/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-lg tracking-widest text-white">
                Wedding by SMS<span className="text-gold-400">Beauty</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour des événements d'exception. Traiteur, mode et
              décoration réunis sous un même toit de prestige.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/smsbeaut.y/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/shamaliya.negafaziyana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-gold-400 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/50 hover:text-gold-400 font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-gold-400 mb-6">
              Nos Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollTo('#services')}
                    className="text-white/50 hover:text-gold-400 font-sans text-sm transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-gold-400 mb-6">
              Coordonnées
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+33666377526"
                  className="text-white/50 hover:text-gold-400 font-sans text-sm transition-colors"
                >
                  +33 6 66 37 75 26
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@weddingbysms.fr"
                  className="text-white/50 hover:text-gold-400 font-sans text-sm transition-colors"
                >
                  contact@weddingbysms.fr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/50 font-sans text-sm">
                  Hyères et Var
                </span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-gold text-xs px-6 py-3 w-full"
              >
                Devis gratuit
              </button>
              <Link
                to="/login"
                className="btn-gold text-xs px-6 py-3 w-full inline-flex items-center justify-center gap-2 bg-charcoal-700 hover:bg-charcoal-600 border border-gold-500 text-gold-500"
              >
                <Settings className="w-3 h-3" />
                Admin
              </Link>
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 font-sans text-xs">
            &copy; {new Date().getFullYear()} SMSBeauty. Tous droits réservés.
          </p>
          <p className="text-white/30 font-sans text-xs">
            Fait avec passion pour vos plus beaux instants
          </p>
        </div>
      </div>
    </footer>
  );
}
