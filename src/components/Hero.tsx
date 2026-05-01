import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SEOHead from './SEOHead';

const carouselImages = [
  '/tajine.jpg',
  '/20240426_173423.jpg',
  '/20240426_173439.jpg',
  '/20240426_215251.jpg',
  '/20240501_114613.jpg',
  '/20240504_214538.jpg',
  '/20240711_151832.jpg',
  '/20240711_151936.jpg',
  '/decoration.jpg',
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = 'Wedding by SMS – Traiteur Oriental, Robes de Soirée et Décoration à Hyères';
  }, []);

  useEffect(() => {
    carouselImages.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="Wedding by SMS – Traiteur Oriental, Robes de Soirée et Décoration à Hyères"
        description="SMSBeauty à Hyères : Traiteur oriental, location de robes de soirée et décoration événementielle pour vos mariages et événements. Plus de 15 ans d'expérience."
        keywords="traiteur oriental mariage, traiteur mariage halal, location robe soirée, décoration mariage, prestataire événementiel Hyères"
      />
      <section
        id="accueil"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
      {carouselImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/75 via-charcoal-900/60 to-charcoal-900/85" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div className="h-px w-12 bg-gold-400" />
          <span className="text-gold-400 font-sans text-sm tracking-[0.3em] uppercase">
            Hyères & Var — Élégance & Raffinement
          </span>
          <div className="h-px w-12 bg-gold-400" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 text-shadow leading-none animate-slide-up">
          Wedding by SMS<span className="text-gold-400">Beauty</span>
        </h1>

        <p className="font-serif italic text-2xl md:text-3xl text-white/90 mb-6 text-shadow-sm animate-slide-up">
          Plus qu'un mariage, une histoire à votre image.
        </p>

        <p className="font-sans text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
          Depuis 15 ans à Hyères, nous mettons notre passion au service de vos plus beaux souvenirs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <button
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-gold"
          >
            Découvrir nos services
          </button>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline-gold border-white/60 text-white hover:border-gold-500"
          >
            Demander un devis
          </button>
        </div>
      </div>

      <button
        onClick={scrollToServices}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-gold-400 transition-colors animate-bounce"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
      </section>
    </>
  );
}
