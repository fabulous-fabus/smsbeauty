import { Clock, Gem, HeartHandshake } from 'lucide-react';

const items = [
  {
    icon: Gem,
    title: 'Qualité Haut de Gamme',
    desc: 'Des produits et prestations sélectionnés avec le plus grand soin.',
  },
  {
    icon: HeartHandshake,
    title: 'Service Personnalisé',
    desc: 'Chaque client bénéficie d\'une attention unique et sur-mesure.',
  },
  {
    icon: Clock,
    title: 'Ponctualité & Fiabilité',
    desc: 'Nous respectons vos délais et vos exigences sans compromis.',
  },
];

export default function Engagements() {
  return (
    <section className="bg-charcoal-800 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 border border-gold-400/40 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-gold-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-serif text-white text-base mb-2">{item.title}</h4>
                <p className="text-white/40 font-sans text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
