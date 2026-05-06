import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import { supabase } from '../lib/supabase';
import type { BlogArticle } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import './BlogArticlePage.css';

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

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [allArticles, setAllArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setError(false);

    const { data: articles } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('publie', true)
      .order('created_at', { ascending: false });

    setAllArticles(articles || []);

    const current = articles?.find((a) => a.slug === slug);
    if (!current) {
      setError(true);
      setLoading(false);
      return;
    }

    setArticle(current);
    window.scrollTo(0, 0);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-charcoal-400">Chargement...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-3xl text-charcoal-800 mb-4">Article non trouvé</h1>
          <p className="text-charcoal-500 mb-8">Cet article n'existe pas ou a été supprimé.</p>
          <Link to="/blog" className="inline-block px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <>
      <SEOHead
        title={article.titre}
        description={article.extrait}
        url={`https://weddingbysms.fr/blog/${article.slug}`}
        image={article.image_url || '/tajine.jpg'}
      />

      <div className="min-h-screen bg-cream-50">
        <div className="bg-charcoal-800 text-white px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>
            <p className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase mb-3">
              {CATEGORY_LABELS[article.categorie] || article.categorie}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{article.titre}</h1>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.titre}
              className="w-full h-96 object-cover rounded-xl shadow-lg mb-12"
            />
          )}

          {article.video_url && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={article.video_url}
                title={article.titre}
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: marked(article.contenu) }}
          />

          <div className="border-t border-stone-200 pt-8 mt-12">
            <div className="flex flex-wrap gap-2 mb-8">
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  CATEGORY_COLORS[article.categorie] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {CATEGORY_LABELS[article.categorie] || article.categorie}
              </span>
            </div>

            {(prevArticle || nextArticle) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prevArticle ? (
                  <Link
                    to={`/blog/${prevArticle.slug}`}
                    className="group flex gap-4 p-4 rounded-lg border border-stone-200 hover:border-gold-400 hover:shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-charcoal-400 mb-1">Article précédent</p>
                      <h3 className="font-serif text-charcoal-800 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {prevArticle.titre}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    to={`/blog/${nextArticle.slug}`}
                    className="group flex gap-4 p-4 rounded-lg border border-stone-200 hover:border-gold-400 hover:shadow-md transition-all justify-end md:justify-start"
                  >
                    <div className="min-w-0 text-right md:text-left">
                      <p className="text-xs text-charcoal-400 mb-1">Article suivant</p>
                      <h3 className="font-serif text-charcoal-800 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {nextArticle.titre}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        </article>

        <div className="bg-white border-t border-stone-200 py-12 mt-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h3 className="font-serif text-2xl text-charcoal-800 mb-4">Besoin d'aide pour votre événement?</h3>
            <p className="text-charcoal-600 mb-8">Nos experts sont à votre disposition pour organiser votre mariage ou événement.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
