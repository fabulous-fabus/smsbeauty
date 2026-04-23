import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Edit2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Devis {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  service: string;
  message: string;
  statut: 'en_attente' | 'traite' | 'refuse';
  reponse: string | null;
  created_at: string;
  repondu_at: string | null;
}

interface Prestation {
  nom: string;
  quantite: number;
  prix_unitaire: number;
}

export default function AdminPanel() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [prestations, setPrestations] = useState<Prestation[]>([
    { nom: '', quantite: 1, prix_unitaire: 0 },
  ]);

  useEffect(() => {
    loadDevis();
  }, []);

  const loadDevis = async () => {
    const { data, error } = await supabase
      .from('devis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading devis:', error);
    } else {
      setDevis(data || []);
    }
    setLoading(false);
  };

  const addPrestation = () => {
    setPrestations([...prestations, { nom: '', quantite: 1, prix_unitaire: 0 }]);
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: any) => {
    const updated = [...prestations];
    updated[index] = { ...updated[index], [field]: value };
    setPrestations(updated);
  };

  const removePrestation = (index: number) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  const calculateTotal = (prestation: Prestation) => {
    return prestation.quantite * prestation.prix_unitaire;
  };

  const calculateGrandTotal = () => {
    return prestations.reduce((sum, p) => sum + calculateTotal(p), 0);
  };

  const submitResponse = async () => {
    if (!selectedDevis) return;

    const response = `Devis préparé pour ${selectedDevis.nom}:\n\n${prestations
      .filter((p) => p.nom)
      .map((p) => `- ${p.nom}: ${p.quantite} × ${p.prix_unitaire}€ = ${calculateTotal(p)}€`)
      .join('\n')}\n\nTOTAL: ${calculateGrandTotal()}€`;

    const { error } = await supabase
      .from('devis')
      .update({
        reponse: response,
        statut: 'traite',
        repondu_at: new Date().toISOString(),
      })
      .eq('id', selectedDevis.id);

    if (error) {
      console.error('Error updating devis:', error);
    } else {
      loadDevis();
      setSelectedDevis(null);
      setPrestations([{ nom: '', quantite: 1, prix_unitaire: 0 }]);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-charcoal-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif">Gestion des Devis</h1>
        <Link to="/" className="flex items-center gap-2 hover:text-gold-500">
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Devis List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gold-500 text-white px-6 py-4">
                <h2 className="font-serif text-lg">Demandes de Devis</h2>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {devis.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDevis(d);
                      setPrestations([{ nom: '', quantite: 1, prix_unitaire: 0 }]);
                    }}
                    className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                      selectedDevis?.id === d.id ? 'bg-gold-50 border-l-4 border-gold-500' : ''
                    }`}
                  >
                    <div className="font-medium text-charcoal-800">{d.nom}</div>
                    <div className="text-sm text-charcoal-500">{d.service}</div>
                    <div className="text-xs text-charcoal-400 mt-2">
                      {new Date(d.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          d.statut === 'en_attente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : d.statut === 'traite'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {d.statut}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Form */}
          <div className="lg:col-span-2">
            {selectedDevis ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-serif text-2xl text-charcoal-800 mb-6">Répondre à {selectedDevis.nom}</h2>

                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Email</label>
                    <input
                      type="email"
                      value={selectedDevis.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-charcoal-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={selectedDevis.telephone}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-charcoal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">Service</label>
                      <input
                        type="text"
                        value={selectedDevis.service}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-charcoal-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Message du client</label>
                    <textarea
                      value={selectedDevis.message}
                      disabled
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-charcoal-700 resize-none"
                    />
                  </div>
                </div>

                {/* Prestations Table */}
                <div className="mb-6">
                  <h3 className="font-medium text-charcoal-800 mb-4">Prestations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gold-500">
                          <th className="text-left py-2 px-3">Prestation</th>
                          <th className="text-center py-2 px-3">Quantité</th>
                          <th className="text-right py-2 px-3">Prix unitaire</th>
                          <th className="text-right py-2 px-3">Total</th>
                          <th className="text-center py-2 px-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prestations.map((p, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-3 px-3">
                              <input
                                type="text"
                                placeholder="Nom de la prestation"
                                value={p.nom}
                                onChange={(e) => updatePrestation(idx, 'nom', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-charcoal-700"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                value={p.quantite}
                                onChange={(e) =>
                                  updatePrestation(idx, 'quantite', parseInt(e.target.value) || 1)
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-charcoal-700"
                              />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={p.prix_unitaire}
                                onChange={(e) =>
                                  updatePrestation(idx, 'prix_unitaire', parseFloat(e.target.value) || 0)
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-right text-charcoal-700"
                              />
                              €
                            </td>
                            <td className="py-3 px-3 text-right font-medium text-charcoal-800">
                              {calculateTotal(p).toFixed(2)}€
                            </td>
                            <td className="py-3 px-3 text-center">
                              {prestations.length > 1 && (
                                <button
                                  onClick={() => removePrestation(idx)}
                                  className="text-red-500 hover:text-red-700 font-medium"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gold-50 border-t-2 border-gold-500">
                          <td colSpan={3} className="py-3 px-3 text-right font-bold text-charcoal-800">
                            TOTAL:
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gold-600 text-lg">
                            {calculateGrandTotal().toFixed(2)}€
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={addPrestation}
                    className="mt-4 px-4 py-2 border border-gold-500 text-gold-500 hover:bg-gold-50 rounded font-medium transition-colors"
                  >
                    + Ajouter une prestation
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={submitResponse}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Envoyer la réponse
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDevis(null);
                      setPrestations([{ nom: '', quantite: 1, prix_unitaire: 0 }]);
                    }}
                    className="px-6 py-3 border border-gray-300 text-charcoal-700 rounded font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Edit2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-charcoal-500">Sélectionnez une demande de devis pour répondre</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
