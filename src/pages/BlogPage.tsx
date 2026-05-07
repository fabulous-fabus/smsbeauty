import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BlogArticle } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import StickyBackButton from '../components/StickyBackButton';

const CATEGORIES = [
  { value: 'all', label: 'Tous les articles' },
  { value: 'presentation', label: 'Présentation' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'traiteur', label: 'Traiteur' },
  { value: 'robes-soiree', label: 'Robes de Soirée' },
];

const CATEGORY_LABELS: Record<string, string> = {
  presentation: 'Présentation',
  decoration: 'Décoration',
  traiteur: 'Traiteur',
  'robes-soiree': 'Robes de Soirée',
};

const CATEGORY_COLORS: Record<string, string> = {
  presentation: 'bg-blue-100 text-blue-800',
  decoration: 'bg-purple-100 text-purple-800',
  traiteur: 'bg-amber-100 text-amber-800',
  'robes-soiree': 'bg-pink-100 text-pink-800',
};

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase
      .from('blog_articles')
      .select('*')
      .eq('publie', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setArticles(data || []);
        setLoading(false);
      });
  }, []);

  const filtered =
    activeCategory === 'all' ? articles : articles.filter((a) => a.categorie === activeCategory);

  return (
    <>
      <SEOHead
        title="Blog – Conseils Mariage & Événements | Wedding by SMS"
        description="Découvrez nos articles sur la décoration de mariage, le traiteur oriental, les robes de soirée et les tendances événementielles à Hyères."
        url="https://weddingbysms.fr/blog"
      />

      <StickyBackButton href="/" label="Retour à l'accueil" />

      <div className="min-h-screen bg-cream-50">
        <div className="bg-charcoal-800 text-white px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase mb-3">
              Wedding by SMS · Hyères
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-3">Notre Blog</h1>
            <p className="text-white/70 text-lg">Inspirations · Conseils · Tendances mariage</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-gold-500 text-white shadow-md'
                    : 'bg-white text-charcoal-600 border border-gray-200 hover:border-gold-400 hover:text-gold-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-charcoal-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-charcoal-600 mb-2">
                Aucun article pour le moment
              </p>
              <p className="text-sm text-charcoal-400">Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <Link to={`/blog/${article.slug}`}>
                    {article.image_url ? (
                      <div className="relative overflow-hidden h-52">
                        <img
                          src={article.image_url}
                          alt={article.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-gold-100 to-cream-200 flex items-center justify-center">
                        <span className="font-serif text-5xl text-gold-400">SMS</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          CATEGORY_COLORS[article.categorie] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {CATEGORY_LABELS[article.categorie] || article.categorie}
                      </span>
                      <span className="text-xs text-charcoal-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <Link to={`/blog/${article.slug}`}>
                      <h2 className="font-serif text-xl text-charcoal-800 mb-2 hover:text-gold-600 transition-colors leading-snug cursor-pointer">
                        {article.titre}
                      </h2>
                    </Link>
                    <p className="text-charcoal-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.extrait}
                    </p>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-gold-600 hover:text-gold-700 text-sm font-medium transition-colors"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
