import { useEffect, useRef, useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  nom: string;
  texte: string;
  note: number;
  created_at: string;
}

const defaultTestimonials = [
  {
    name: 'Yasmine B.',
    event: 'Mariage — Juin 2024',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: "SMSBeauty a transformé notre mariage en un véritable conte de fées. La décoration était somptueuse, le traiteur a régalé tous nos invités, et ma robe était absolument parfaite. Un grand merci à toute l'équipe !",
  },
  {
    name: 'Fatima R.',
    event: 'Fiançailles — Mars 2024',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: "Une prestation irréprochable du début à la fin. Les saveurs orientales étaient authentiques et généreuses. Nos invités n'ont pas cessé de nous complimenter. Je recommande les yeux fermés !",
  },
  {
    name: 'Leila M.',
    event: 'Anniversaire — Décembre 2023',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: "J'ai loué une robe de soirée pour les 40 ans de mon mari — époustouflante ! L'équipe était à l'écoute, professionnelle et créative. La décoration de la salle était féerique. Merci SMSBeauty !",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const rating = testimonial.note || testimonial.rating || 5;
  const name = testimonial.nom || testimonial.name;
  const text = testimonial.texte || testimonial.text;
  const avatar = testimonial.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200';
  const event = testimonial.event || new Date(testimonial.created_at).toLocaleDateString('fr-FR');

  return (
    <div
      ref={ref}
      className={`bg-white p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-700 relative ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Quote className="w-10 h-10 text-gold-200 absolute top-6 right-6" />

      <div className="flex gap-1 mb-5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
        ))}
      </div>

      <p className="text-charcoal-500 text-sm leading-relaxed mb-8 italic">
        "{text}"
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-stone-100">
        <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <p className="font-serif text-charcoal-800 font-medium">{name}</p>
          <p className="text-gold-500 font-sans text-xs tracking-wider">{event}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('affiche', true)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setTestimonials(data);
    }
  };

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="temoignages" className="py-28 bg-charcoal-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <p className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Ce que disent nos clients
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white text-center mb-4 leading-tight">
            Témoignages
          </h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="text-white/50 text-center text-lg max-w-2xl mx-auto leading-relaxed">
            Leur bonheur est notre plus belle récompense.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute -left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gold-500 hover:bg-gold-600 disabled:bg-charcoal-700 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gold-500 hover:bg-gold-600 disabled:bg-charcoal-700 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {testimonials.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(testimonials.length - itemsPerPage + 1) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? 'bg-gold-500 w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Aller au groupe ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-white/70 text-sm mb-6">
            Vous aussi, faites confiance à Wedding by SMS pour votre événement à Hyères et dans le Var.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="btn-gold"
          >
            Demander un devis gratuit
          </a>
        </div>
      </div>
    </section>
  );
}
