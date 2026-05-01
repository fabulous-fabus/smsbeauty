import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Edit2, Check, AlertCircle, Star } from 'lucide-react';

interface Review {
  id: string;
  nom: string;
  texte: string;
  note: number;
  affiche: boolean;
  comment_date: string | null;
  created_at: string;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    texte: '',
    note: 5,
    comment_date: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.nom.trim() || !formData.texte.trim()) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (editingId) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            nom: formData.nom,
            texte: formData.texte,
            note: formData.note,
            comment_date: formData.comment_date || null,
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccessMessage('✅ Avis mis à jour');
      } else {
        // Create new review
        const { error } = await supabase.from('reviews').insert([
          {
            nom: formData.nom,
            texte: formData.texte,
            note: formData.note,
            comment_date: formData.comment_date || null,
            affiche: true,
          },
        ]);

        if (error) throw error;
        setSuccessMessage('✅ Avis ajouté');
      }

      setFormData({ nom: '', texte: '', note: 5, comment_date: '' });
      setEditingId(null);
      setTimeout(() => {
        loadReviews();
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setErrorMessage(errorMsg);
    }
  };

  const handleEdit = (review: Review) => {
    setFormData({
      nom: review.nom,
      texte: review.texte,
      note: review.note,
      comment_date: review.comment_date || '',
    });
    setEditingId(review.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);

      if (error) throw error;
      setSuccessMessage('✅ Avis supprimé');
      setTimeout(() => {
        loadReviews();
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setErrorMessage(errorMsg);
    }
  };

  const toggleDisplay = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ affiche: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadReviews();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setErrorMessage(errorMsg);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-serif text-xl text-charcoal-800 mb-6">
          {editingId ? 'Modifier l\'avis' : 'Ajouter un nouvel avis'}
        </h3>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-2">Nom du client</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Marie Dupont"
              className="w-full px-4 py-2 border border-gray-300 rounded text-charcoal-700 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-2">Avis</label>
            <textarea
              value={formData.texte}
              onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
              placeholder="L'avis du client..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded text-charcoal-700 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-2">Note</label>
            <select
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-charcoal-700 focus:outline-none focus:border-gold-500"
            >
              <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
              <option value="4">⭐⭐⭐⭐ 4 stars</option>
              <option value="3">⭐⭐⭐ 3 stars</option>
              <option value="2">⭐⭐ 2 stars</option>
              <option value="1">⭐ 1 star</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-2">Date du commentaire (optionnel)</label>
            <input
              type="date"
              value={formData.comment_date}
              onChange={(e) => setFormData({ ...formData, comment_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-charcoal-700 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded font-medium transition-colors"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter l\'avis'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ nom: '', texte: '', note: 5, comment_date: '' });
                  setEditingId(null);
                }}
                className="px-6 py-3 border border-gray-300 text-charcoal-700 rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gold-500 text-white px-6 py-4">
          <h3 className="font-serif text-lg">Avis clients ({reviews.length})</h3>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center text-charcoal-500">Aucun avis pour le moment</div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-800">{review.nom}</div>
                    <div className="flex items-center gap-1 text-gold-500 text-sm mt-1">
                      {[...Array(review.note)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      {[...Array(5 - review.note)].map((_, i) => (
                        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-charcoal-600 text-sm mb-3">{review.texte}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-charcoal-400">
                    {review.comment_date
                      ? new Date(review.comment_date).toLocaleDateString('fr-FR')
                      : new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <button
                    onClick={() => toggleDisplay(review.id, review.affiche)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      review.affiche
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {review.affiche ? 'Affiché' : 'Masqué'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
