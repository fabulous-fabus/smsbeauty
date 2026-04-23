import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const contactInfo = [
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+33 6 66 37 75 26',
    link: 'tel:+33600000000',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@smsbeauty.fr',
    link: 'mailto:contact@smsbeauty.fr',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Hyères et Var',
    link: '#',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insert into Supabase
      const { error: dbError } = await supabase.from('devis').insert([
        {
          nom: formData.name,
          email: formData.email,
          telephone: formData.phone,
          service: formData.service,
          message: formData.message,
          statut: 'en_attente',
        },
      ]);

      if (dbError) throw new Error(dbError.message);

      // Send email via Netlify function (ignore in dev if not available)
      try {
        const response = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok && response.status !== 404) {
          console.warn('Email notification failed');
        }
      } catch (emailErr) {
        console.warn('Netlify functions not available in dev mode');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <p className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Parlons de votre projet
          </p>
          <h2 className="section-title">Contactez-Nous</h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="section-subtitle">
            Votre événement mérite toute notre attention. Décrivez-nous votre projet et nous
            vous recontacterons dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl text-charcoal-800 mb-6">
                Nous sommes à votre écoute
              </h3>
              <p className="text-charcoal-500 text-sm leading-relaxed mb-10">
                Que vous organisiez un mariage, une soirée privée ou un événement d'entreprise,
                notre équipe vous accompagne de A à Z pour créer des moments inoubliables.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={info.title}
                      href={info.link}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 border border-gold-300 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-gold-500 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-1">
                          {info.title}
                        </p>
                        <p className="text-charcoal-700 font-medium">{info.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 bg-charcoal-800 p-8">
              <p className="font-serif italic text-lg text-gold-300 leading-snug mb-4">
                "Faites confiance à SMSBeauty pour transformer votre vision en réalité."
              </p>
              <div className="h-px w-8 bg-gold-500" />
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white border border-stone-100 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-96">
                <CheckCircle className="w-16 h-16 text-gold-500 mb-6" />
                <h3 className="font-serif text-2xl text-charcoal-800 mb-3">
                  Message envoyé !
                </h3>
                <p className="text-charcoal-500 text-sm leading-relaxed max-w-sm mb-6">
                  Merci pour votre message. Notre équipe vous
                  contactera très prochainement pour discuter de votre projet.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gold-500 hover:text-gold-600 font-medium text-sm"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-stone-100 shadow-sm p-8 space-y-6"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                      className="w-full border border-stone-200 px-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:border-gold-400 transition-colors bg-transparent placeholder-charcoal-300"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.fr"
                      className="w-full border border-stone-200 px-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:border-gold-400 transition-colors bg-transparent placeholder-charcoal-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 66 37 75 26"
                      className="w-full border border-stone-200 px-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:border-gold-400 transition-colors bg-transparent placeholder-charcoal-300"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-2">
                      Service souhaité *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full border border-stone-200 px-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:border-gold-400 transition-colors bg-transparent appearance-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option>Traiteur oriental</option>
                      <option>Location de robe de soirée</option>
                      <option>Vente de robe de soirée</option>
                      <option>Décoration événementielle</option>
                      <option>Forfait complet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-charcoal-400 mb-2">
                    Votre message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Décrivez votre événement, la date, le nombre de personnes..."
                    className="w-full border border-stone-200 px-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:border-gold-400 transition-colors bg-transparent resize-none placeholder-charcoal-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer ma demande
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
