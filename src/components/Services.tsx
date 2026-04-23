import { useEffect, useRef, useState } from 'react';
import { UtensilsCrossed, Shirt, Sparkles, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: UtensilsCrossed,
    title: 'Traiteur Oriental',
    subtitle: 'Saveurs authentiques d\'exception',
    description:
      "Des mets raffinés inspirés des cuisines marocaine, algérienne et orientale, préparés avec des épices sélectionnées et un savoir-faire artisanal transmis de génération en génération.",
    image:
      'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Buffets & banquets', 'Menus personnalisés', 'Pâtisseries orientales', 'Service à domicile'],
    color: 'from-amber-900/80',
  },
  {
    icon: Shirt,
    title: 'Robes de Soirée',
    subtitle: 'Location & vente sur mesure',
    description:
      "Une collection exclusive de robes de soirée orientales et occidentales — karakou, robe de mariée, soirée chic — pour que vous brilliez de mille feux lors de vos événements les plus importants.",
    image:
      'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Collection exclusive', 'Ajustements sur mesure', 'Location & vente', 'Conseils stylisme'],
    color: 'from-rose-900/80',
  },
  {
    icon: Sparkles,
    title: 'Décoration Événementielle',
    subtitle: 'Créez l\'atmosphère de vos rêves',
    description:
      "Transformez chaque espace en un décor somptueux. Mariage, fiançailles, anniversaire — nos équipes créent des ambiances uniques avec fleurs, lumières et ornements raffinés.",
    image:
      'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Mariages & fiançailles', 'Scénographies florales', 'Éclairages d\'ambiance', 'Installation complète'],
    color: 'from-stone-900/80',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-none transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.color} to-transparent opacity-70`} />
        <div className="absolute top-6 left-6">
          <div className="w-12 h-12 border border-gold-400/60 flex items-center justify-center bg-charcoal-900/40 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-gold-400" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border border-stone-100 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        <p className="text-gold-500 font-sans text-xs tracking-[0.25em] uppercase mb-2">
          {service.subtitle}
        </p>
        <h3 className="font-serif text-2xl text-charcoal-800 mb-4">{service.title}</h3>
        <div className="h-px w-10 bg-gold-400 mb-5" />
        <p className="text-charcoal-500 text-sm leading-relaxed mb-6">{service.description}</p>

        <ul className="space-y-2 mb-8">
          {service.features.map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-charcoal-600 text-sm">
              <span className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        <button
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-gold-500 font-sans text-sm tracking-wider uppercase hover:text-gold-600 transition-colors group/btn"
        >
          En savoir plus
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-28 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <p className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Ce que nous offrons
          </p>
          <h2 className="section-title">Nos Services</h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subtitle">
            De la gastronomie orientale aux tenues de rêve, en passant par une décoration fastueuse
            — SMSBeauty sublime chaque instant de votre célébration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
