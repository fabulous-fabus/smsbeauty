import { useEffect, useState } from 'react';
import { Loader, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ServiceImage {
  id: string;
  image_url: string;
}

interface ServiceSection {
  id: string;
  name: string;
  contactService: string;
  defaultImages?: string[];
}

const services: ServiceSection[] = [
  { id: 'traiteur-oriental', name: 'Traiteur Oriental', contactService: 'Traiteur oriental', defaultImages: [] },
  { id: 'robes-soiree', name: 'Robes de Soirée', contactService: 'Location de robe de soirée' },
  { id: 'decoration-evenementielle', name: 'Décoration Événementielle', contactService: 'Décoration événementielle' },
];

function ServiceGallery({ service }: { service: ServiceSection }) {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => ((prev ?? 0) + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => ((prev ?? 0) - 1 + images.length) % images.length);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, images.length]);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('service_images')
      .select('id, image_url')
      .eq('service_id', service.id)
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) console.error('Error loading images:', error);

    const supabaseImages = data || [];
    if (supabaseImages.length === 0 && service.defaultImages) {
      setImages(service.defaultImages.map((url, index) => ({ id: `default-${index}`, image_url: url })));
    } else {
      setImages(supabaseImages);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="section-title mb-8">{service.name}</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Link to={`/service/${service.id}`} className="btn-outline-gold text-sm">
            En savoir plus
          </Link>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('selectService', { detail: service.contactService }));
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-gold text-sm"
          >
            Demander un devis
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-500 text-lg">Photos à venir...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative h-64 md:h-72 overflow-hidden rounded-lg shadow-xl group border-4 border-gold-400 cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={image.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={images[lightboxIndex].image_url}
            alt={service.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-colors"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-colors"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-charcoal-800 rounded-full p-2 transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}

export default function Services() {
  return (
    <div id="services" className="bg-cream-50">
      <div className="text-center pt-28 pb-4">
        <p className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-4">
          Ce que nous proposons
        </p>
        <h2 className="section-title">Nos Services</h2>
        <div className="gold-divider mt-6" />
      </div>
      {services.map((service) => (
        <ServiceGallery key={service.id} service={service} />
      ))}
    </div>
  );
}
