import { useEffect, useRef, useState } from 'react';
import { Award, Heart, Users, Star } from 'lucide-react';

const stats = [
  { icon: Heart, value: '150+', label: 'Événements réalisés' },
  { icon: Users, value: '300+', label: 'Clients satisfaits' },
];

export default function About() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="apropos" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/histoire.jpg"
                alt="SMSBeauty"
                className="w-full h-[480px] object-contain object-center bg-gray-50"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-2/3 h-80 border-2 border-gold-300 z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold-100 z-0" />

            <div className="absolute bottom-8 left-8 bg-charcoal-900 text-white p-6 z-20 max-w-xs">
              <p className="font-serif italic text-lg text-gold-300 leading-snug">
                "Chaque célébration mérite d'être exceptionnelle."
              </p>
              <div className="mt-3 h-px w-8 bg-gold-500" />
              <p className="mt-2 font-sans text-xs tracking-widest text-white/60 uppercase">
                L'équipe SMSBeauty
              </p>
            </div>
          </div>

          <div>
            <p className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-4">
              Notre histoire
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 mb-6 leading-tight">
              L'excellence au service<br />
              <span className="text-gold-500">de vos moments précieux</span>
            </h2>
            <div className="h-px w-12 bg-gold-400 mb-8" />

            <div className="space-y-5 text-charcoal-500 leading-relaxed">
              <p>
                Depuis plus de <strong className="text-charcoal-700">15 ans à Hyères et dans le Var</strong>, notre entreprise
                familiale met son savoir-faire et sa passion au service de vos plus beaux moments.
                Spécialisés dans l'organisation de mariages, nous vous accompagnons de A à Z : mise
                en place, décoration, traiteur aux saveurs marocaines, avec une capacité d'adaptation
                à chaque culture, chaque envie et chaque histoire.
              </p>
              <p>
                Parce que chaque mariage est unique, nous créons des événements à votre image, avec
                authenticité et élégance.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 border border-gold-300 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-gold-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="font-serif text-2xl text-charcoal-800">{stat.value}</p>
                      <p className="text-charcoal-500 text-sm">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold"
              >
                Travaillons ensemble
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
