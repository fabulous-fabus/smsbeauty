import { useEffect, useRef, useState } from 'react';

const galleryItems = [
  {
    image: '/photo-hero.jpg',
    category: 'Nos Événements',
    label: 'Ambiance de fête',
    tall: false,
  },
  {
    image: '/notre-histoire.jpg',
    category: 'Notre Histoire',
    label: 'Qui nous sommes',
    tall: false,
  },
  {
    image: '/tajine.jpg',
    category: 'Traiteur Oriental',
    label: 'Saveurs authentiques',
    tall: false,
  },
  {
    image: '/decoration.jpg',
    category: 'Décoration',
    label: 'Créativité et élégance',
    tall: false,
  },
];

function GalleryItem({ item, index }: { item: typeof galleryItems[0]; index: number }) {
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
    <div
      ref={ref}
      className={`relative overflow-hidden group cursor-pointer transition-all duration-700 ${
        item.tall ? 'row-span-2' : ''
      } ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <img
        src={item.image}
        alt={item.label}
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
          item.tall ? 'h-full min-h-[400px]' : 'h-64'
        }`}
      />
      <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/60 transition-all duration-400" />
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 p-4">
        <span className="text-gold-400 font-sans text-xs tracking-[0.25em] uppercase mb-2">
          {item.category}
        </span>
        <span className="font-serif text-white text-lg text-center">{item.label}</span>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="galerie" className="py-28 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <p className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Nos réalisations
          </p>
          <h2 className="section-title">Galerie</h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subtitle">
            Un aperçu de nos prestations — chaque image raconte une histoire, celle de moments
            gravés à jamais dans les mémoires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-64">
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
