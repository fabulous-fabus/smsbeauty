import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Politique de Confidentialité – Wedding by SMS"
        description="Politique de confidentialité et protection des données personnelles"
        noindex={false}
      />
      <div className="min-h-screen bg-cream-50">
        <nav className="bg-charcoal-800 text-white px-6 py-4">
          <Link to="/" className="flex items-center gap-2 hover:text-gold-500">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="font-serif text-4xl text-charcoal-800 mb-8">Politique de Confidentialité</h1>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8 text-charcoal-700">
            {/* 1. Identité */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">1. Responsable du Traitement</h2>
              <p className="mb-3">
                <strong>Wedding by SMS</strong><br />
                Hyères, Var (83)<br />
                France
              </p>
              <p className="text-sm text-charcoal-600">
                Contact : <a href="mailto:contact@weddingbysms.fr" className="text-gold-500 hover:text-gold-600">contact@weddingbysms.fr</a>
              </p>
            </section>

            {/* 2. Données collectées */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">2. Données Collectées</h2>
              <p className="mb-4">Nous collectons les données suivantes :</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Formulaire de contact :</strong> Nom, email, téléphone, message</li>
                <li><strong>Demande de devis :</strong> Nom, email, téléphone, service demandé, message</li>
                <li><strong>Google Analytics :</strong> Adresse IP anonymisée, type de navigateur, pages visitées, durée des visites</li>
                <li><strong>Cookies :</strong> Préférences de consentement</li>
              </ul>
            </section>

            {/* 3. Finalité */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">3. Finalité du Traitement</h2>
              <p className="mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Répondre à vos demandes de devis et d'information</li>
                <li>Améliorer nos services grâce à Google Analytics</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            {/* 4. Base légale */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">4. Base Légale</h2>
              <p className="text-sm">
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Consentement explicite</strong> : Pour les formulaires de contact et Google Analytics</li>
                <li><strong>Exécution de contrat</strong> : Pour traiter vos demandes de devis</li>
                <li><strong>Obligation légale</strong> : Pour respecter la loi française et RGPD</li>
              </ul>
            </section>

            {/* 5. Cookies */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">5. Cookies et Consentement</h2>
              <p className="mb-4 text-sm">
                Nous utilisons les cookies suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Cookies de consentement :</strong> Mémorisent votre choix concernant Google Analytics</li>
                <li><strong>Google Analytics :</strong> Uniquement si vous acceptez (optionnel)</li>
              </ul>
              <p className="text-sm mt-4">
                Vous pouvez refuser les cookies analytiques via la bannière de consentement sans affecter votre accès au site.
              </p>
            </section>

            {/* 6. Partage des données */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">6. Partage des Données</h2>
              <p className="text-sm">
                Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles peuvent être partagées avec :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
                <li><strong>Google Analytics</strong> : Pour analyser le trafic du site (données anonymisées)</li>
                <li><strong>Prestataires techniques</strong> : Supabase pour stocker les demandes de devis</li>
              </ul>
            </section>

            {/* 7. Durée de conservation */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">7. Durée de Conservation</h2>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Demandes de devis :</strong> 3 ans (obligation légale)</li>
                <li><strong>Formulaires de contact :</strong> 1 an</li>
                <li><strong>Cookies de consentement :</strong> 1 an</li>
                <li><strong>Données Google Analytics :</strong> 26 mois</li>
              </ul>
            </section>

            {/* 8. Droits des utilisateurs */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">8. Vos Droits RGPD</h2>
              <p className="mb-4 text-sm">
                Vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit à l'oubli :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format standard</li>
                <li><strong>Droit d'opposition :</strong> Refuser le traitement de vos données</li>
              </ul>
              <p className="text-sm mt-4">
                Pour exercer ces droits, contactez-nous à <a href="mailto:contact@weddingbysms.fr" className="text-gold-500 hover:text-gold-600">contact@weddingbysms.fr</a>
              </p>
            </section>

            {/* 9. Sécurité */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">9. Sécurité des Données</h2>
              <p className="text-sm">
                Nous utilisons des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification, ou la divulgation. Nos serveurs sont hébergés par des prestataires sécurisés (Supabase, Netlify).
              </p>
            </section>

            {/* 10. Contact CNIL */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">10. Contact et Réclamations</h2>
              <p className="mb-3 text-sm">
                Pour toute question concernant cette politique, contactez-nous :
              </p>
              <p className="text-sm">
                Email : <a href="mailto:contact@weddingbysms.fr" className="text-gold-500 hover:text-gold-600">contact@weddingbysms.fr</a>
              </p>
              <p className="text-sm mt-4">
                Vous avez également le droit de déposer une plainte auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">www.cnil.fr</a>
              </p>
            </section>

            {/* 11. Modifications */}
            <section>
              <h2 className="font-serif text-2xl text-charcoal-800 mb-4">11. Modifications de cette Politique</h2>
              <p className="text-sm">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page. Votre utilisation continue du site après les modifications signifie votre acceptation des nouvelles conditions.
              </p>
              <p className="text-xs text-charcoal-500 mt-4">
                Dernière mise à jour : Avril 2026
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
