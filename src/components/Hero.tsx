import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/maroc.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/75 via-charcoal-900/60 to-charcoal-900/85" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div className="h-px w-12 bg-gold-400" />
          <span className="text-gold-400 font-sans text-sm tracking-[0.3em] uppercase">
            Élégance & Raffinement
          </span>
          <div className="h-px w-12 bg-gold-400" />
        </div>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-6 text-shadow leading-none animate-slide-up">
          SMS<span className="text-gold-400">Beauty</span>
        </h1>

        <p className="font-serif italic text-2xl md:text-3xl text-white/90 mb-6 text-shadow-sm animate-slide-up">
          Plus qu'un mariage, une histoire à votre image.
        </p>

        <p className="font-sans text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
          Depuis 15 ans, nous mettons notre passion au service de vos plus beaux souvenirs.
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
  );
}
