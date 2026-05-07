import { Check, ChevronDown, ChevronUp, MapPin, Users, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import StickyBackButton from '../components/StickyBackButton';
import RichSnippets from '../components/RichSnippets';

const serviceSEO: Record<string, { title: string; description: string; keywords: string }> = {
  'traiteur-oriental': {
    title: 'Traiteur oriental 100 % halal - mariage, anniversaire, fiançailles, wedding by SMS',
    description: 'Traiteur oriental à Hyères et dans le Var : cuisine marocaine, algérienne, buffets et menus personnalisés pour mariages, fiançailles et événements. Devis gratuit.',
    keywords: 'traiteur oriental mariage Hyères, traiteur marocain Var, traiteur mariage halal, cuisine orientale, buffet mariage Toulon',
  },
  'robes-soiree': {
    title: 'Location Robes de Soirée Orientales Hyères – Wedding by SMS',
    description: 'Location et vente de robes de soirée orientales à Hyères : karakou, robes de mariée, ajustements sur mesure.',
    keywords: 'location robe soirée orientale Hyères, karakou location, robe mariée orientale',
  },
  'decoration-evenementielle': {
    title: 'Décoration Événementielle Mariage Hyères – Wedding by SMS',
    description: 'Décoration événementielle à Hyères : mariages, fiançailles avec fleurs, lumières et ornements raffinés.',
    keywords: 'décoration événementielle mariage Hyères, décoration mariage Var',
  },
};

const faqTraiteur = [
  {
    q: 'Quels types de cuisine proposez-vous ?',
    a: 'Nous proposons une cuisine orientale authentique : marocaine, algérienne et tunisienne. Tajines, couscous, pastillas, pâtisseries orientales et bien plus encore, préparés avec des épices sélectionnées.',
  },
  {
    q: 'Pouvez-vous adapter le menu à des régimes alimentaires spécifiques ?',
    a: 'Oui, nous adaptons tous nos menus : halal, sans gluten, végétarien, allergie alimentaire. Il suffit de nous le préciser lors de votre demande de devis.',
  },
  {
    q: 'Quel est le nombre minimum de personnes ?',
    a: "Nous intervenons à partir de 20 personnes. Pour les grands événements (200+ personnes), nous disposons d'une équipe renforcée.",
  },
  {
    q: 'Livrez-vous en dehors de Hyères ?',
    a: "Oui, nous intervenons dans tout le Var : Toulon, La Seyne-sur-Mer, Brignoles, Saint-Tropez, Fréjus et alentours. Des frais de déplacement peuvent s'appliquer selon la distance.",
  },
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Nous recommandons de réserver au minimum 2 à 3 mois à l'avance pour les mariages. Pour les autres événements, 3 à 4 semaines suffisent en général.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqTraiteur.map((item, i) => (
        <div key={i} className="border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-cream-50 transition-colors"
          >
            <span className="font-medium text-charcoal-800 text-sm">{item.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-gold-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gold-500 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-6 py-4 bg-cream-50 border-t border-stone-100">
              <p className="text-charcoal-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const seo = serviceId ? serviceSEO[serviceId] : null;

  useEffect(() => { window.scrollTo(0, 0); }, [serviceId]);
  useEffect(() => {
    if (seo) document.title = seo.title;
    return () => { document.title = 'Wedding by SMS – Traiteur Oriental, Robes de Soirée et Décoration à Hyères'; };
  }, [seo]);

  if (serviceId !== 'traiteur-oriental' && serviceId !== 'robes-soiree' && serviceId !== 'decoration-evenementielle') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-charcoal-800 mb-4">Service non trouvé</h1>
          <Link to="/" className="text-gold-500 hover:text-gold-600 font-medium">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  if (serviceId === 'traiteur-oriental') {
    return (
      <>
        {seo && <SEOHead title={seo.title} description={seo.description} keywords={seo.keywords} url={`https://weddingbysms.fr/service/${serviceId}`} />}
        <RichSnippets
          type="Service"
          data={{
            name: 'Traiteur Oriental',
            description: seo?.description,
            url: `https://weddingbysms.fr/service/${serviceId}`,
            image: 'https://weddingbysms.fr/tajine.jpg',
            serviceType: 'Catering',
            priceRange: '$$',
            offers: [
              {
                '@type': 'Offer',
                name: 'Buffet froid et chaud',
                priceCurrency: 'EUR',
                price: '18-35',
                priceValidUntil: '2027-12-31',
              },
              {
                '@type': 'Offer',
                name: 'Cocktail dînatoire',
                priceCurrency: 'EUR',
                price: '25-50',
                priceValidUntil: '2027-12-31',
              },
              {
                '@type': 'Offer',
                name: 'Plat unique',
                priceCurrency: 'EUR',
                price: '12-20',
                priceValidUntil: '2027-12-31',
              },
              {
                '@type': 'Offer',
                name: 'Menu complet',
                priceCurrency: 'EUR',
                price: '45-80',
                priceValidUntil: '2027-12-31',
              },
            ],
          }}
        />
        <StickyBackButton href="/#services" label="Retour aux services" />
        <div className="min-h-screen bg-cream-50">

          {/* Header */}
          <div className="bg-charcoal-800 text-white px-6 py-10">
            <div className="max-w-7xl mx-auto">
              <p className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase mb-3">Wedding by SMS · Hyères</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-3">Traiteur Oriental</h1>
              <p className="text-white/70 text-lg">Saveurs authentiques · Cuisine maison · Devis gratuit</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-20">

            {/* Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-5">
                <h2 className="font-serif text-3xl text-charcoal-800">Un traiteur oriental à votre service à Hyères</h2>
                <p className="text-charcoal-600 leading-relaxed">
                  Depuis plus de 15 ans, <strong>Wedding by SMS</strong> régale vos convives avec une cuisine orientale authentique préparée avec passion. Tajines parfumés, couscous généreux, pastillas dorées, briwats croustillants et pâtisseries orientales — chaque plat est une invitation au voyage.
                </p>
                <p className="text-charcoal-500 leading-relaxed">
                  Nous adaptons nos menus à votre événement, au nombre de vos invités et à vos envies. Cuisine 100% halal, ingrédients frais sélectionnés, présentation soignée. Nous intervenons à domicile, en salle ou en extérieur dans tout le <strong>Var</strong>.
                </p>
                <ul className="space-y-2 pt-2">
                  {['Buffets & banquets orientaux', 'Menus personnalisés', 'Pâtisseries et douceurs orientales', 'Service et installation compris', 'Cuisine halal certifiée', 'Adaptation aux allergies et régimes'].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-charcoal-600 text-sm">
                      <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Box */}
              <div className="bg-white border border-stone-100 shadow-sm p-8 h-fit space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />)}
                </div>
                <p className="font-serif text-lg text-charcoal-800">Demandez votre devis gratuit</p>
                <p className="text-charcoal-500 text-sm">Réponse sous 24h. Sans engagement.</p>
                <Link
                  to="/#contact-form"
                  onClick={() => sessionStorage.setItem('preselectedService', 'Traiteur oriental')}
                  className="block w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-3 text-center transition-colors"
                >
                  Demander un devis
                </Link>
                <div className="pt-2 space-y-2 text-sm text-charcoal-500">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> Hyères et Var</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gold-400" /> À partir de 20 personnes</div>
                </div>
              </div>
            </div>

            {/* Types d'événements */}
            <div>
              <h2 className="font-serif text-3xl text-charcoal-800 mb-2">Pour quel événement ?</h2>
              <div className="h-px w-12 bg-gold-400 mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Mariage', desc: 'Buffets grandioses ou menus assis, nous créons un festin mémorable pour votre jour J.' },
                  { title: 'Fiançailles', desc: 'Une soirée intime ou une grande célébration, nos saveurs orientales subliment vos fiançailles.' },
                  { title: 'Anniversaire', desc: 'Un anniversaire inoubliable avec des plats savoureux et une présentation raffinée.' },
                  { title: 'Baptême & Circoncision', desc: 'Des mets traditionnels pour célébrer ces moments de famille avec authenticité.' },
                  { title: 'Soirée privée', desc: 'Réception à domicile ou en salle, nous nous adaptons à votre espace et vos envies.' },
                  { title: 'Événement d\'entreprise', desc: 'Cocktails, séminaires, repas d\'affaires — une cuisine orientale qui marque les esprits.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-stone-100 p-6 hover:border-gold-300 transition-colors">
                    <h3 className="font-serif text-lg text-charcoal-800 mb-3">{item.title}</h3>
                    <p className="text-charcoal-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone géographique */}
            <div className="bg-charcoal-800 text-white p-10 rounded-lg">
              <h2 className="font-serif text-3xl mb-2">Zone d'intervention</h2>
              <div className="h-px w-12 bg-gold-400 mb-8" />
              <p className="text-white/70 mb-8">Nous intervenons dans tout le département du Var et les alentours :</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Hyères', 'Toulon', 'La Seyne-sur-Mer', 'Brignoles', 'Fréjus', 'Saint-Tropez', 'Draguignan', 'Six-Fours-les-Plages'].map((ville) => (
                  <div key={ville} className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-3 h-3 text-gold-400 flex-shrink-0" />
                    {ville}
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-6">Des frais de déplacement peuvent s'appliquer selon la distance depuis Hyères.</p>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-serif text-3xl text-charcoal-800 mb-2">Questions fréquentes</h2>
              <div className="h-px w-12 bg-gold-400 mb-10" />
              <FAQ />
            </div>

            {/* CTA final */}
            <div className="bg-cream-50 border border-gold-200 p-12 text-center">
              <h2 className="font-serif text-3xl text-charcoal-800 mb-4">Prêt à régaler vos invités ?</h2>
              <p className="text-charcoal-500 mb-8 max-w-xl mx-auto">
                Contactez-nous pour discuter de votre événement et recevoir un devis personnalisé gratuit sous 24h.
              </p>
              <Link
                to="/#contact-form"
                onClick={() => sessionStorage.setItem('preselectedService', 'Traiteur oriental')}
                className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-medium px-10 py-4 transition-colors"
              >
                Demander un devis gratuit
              </Link>
            </div>

          </div>
        </div>
      </>
    );
  }

  // Generic page for other services
  const genericContent: Record<string, { title: string; subtitle: string; description: string; features: string[] }> = {
    'robes-soiree': {
      title: 'Robes de Soirée',
      subtitle: 'Location & vente sur mesure',
      description: 'Une collection exclusive de robes de soirée orientales et occidentales — karakou, robe de mariée, soirée chic — pour que vous brilliez de mille feux lors de vos événements les plus importants.',
      features: ['Collection exclusive', 'Ajustements sur mesure', 'Location & vente', 'Conseils stylisme', 'Robes orientales authentiques', 'Prix compétitifs'],
    },
    'decoration-evenementielle': {
      title: 'Décoration Événementielle',
      subtitle: 'Créez l\'atmosphère de vos rêves',
      description: 'Transformez chaque espace en un décor somptueux. Mariage, fiançailles, anniversaire — nos équipes créent des ambiances uniques avec fleurs, lumières et ornements raffinés.',
      features: ['Mariages & fiançailles', 'Scénographies florales', 'Éclairages d\'ambiance', 'Installation complète', 'Design sur mesure', 'Fleurs fraîches premium'],
    },
  };

  const content = genericContent[serviceId!];
  const contactServiceName: Record<string, string> = {
    'robes-soiree': 'Location de robe de soirée',
    'decoration-evenementielle': 'Décoration événementielle',
  };

  return (
    <>
      {seo && <SEOHead title={seo.title} description={seo.description} keywords={seo.keywords} url={`https://weddingbysms.fr/service/${serviceId}`} />}
      <RichSnippets
        type="Service"
        data={{
          name: content.title,
          description: content.description,
          url: `https://weddingbysms.fr/service/${serviceId}`,
          image: 'https://weddingbysms.fr/tajine.jpg',
          serviceType: content.title,
          priceRange: '$$',
        }}
      />
      <StickyBackButton href="/#services" label="Retour aux services" />
      <div className="min-h-screen bg-cream-50">
        <div className="bg-charcoal-800 text-white px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase mb-3">Wedding by SMS · Hyères</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-3">{content.title}</h1>
            <p className="text-white/70 text-lg">{content.subtitle}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-5">
              <p className="text-charcoal-600 leading-relaxed text-lg">{content.description}</p>
              <ul className="space-y-2 pt-2">
                {content.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-charcoal-600 text-sm">
                    <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-stone-100 shadow-sm p-8 h-fit space-y-4">
              <p className="font-serif text-lg text-charcoal-800">Demandez votre devis gratuit</p>
              <p className="text-charcoal-500 text-sm">Réponse sous 24h. Sans engagement.</p>
              <Link
                to="/#contact-form"
                onClick={() => sessionStorage.setItem('preselectedService', contactServiceName[serviceId!])}
                className="block w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-3 text-center transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
