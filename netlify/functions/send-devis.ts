import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Prestation {
  nom: string;
  quantite: number;
  prix_unitaire: number;
}

interface DevisData {
  clientName: string;
  clientEmail: string;
  service: string;
  prestations: Prestation[];
  total: number;
}

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

const validateDevisInput = (data: DevisData): string | null => {
  if (!data.clientName || !data.clientEmail) {
    return 'Missing required fields';
  }
  if (data.clientName.length > 100) {
    return 'Name too long (max 100 characters)';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    return 'Invalid email format';
  }
  if (!Array.isArray(data.prestations) || data.prestations.length === 0) {
    return 'No prestations provided';
  }
  if (typeof data.total !== 'number' || data.total < 0) {
    return 'Invalid total amount';
  }
  return null;
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data: DevisData = JSON.parse(event.body || '{}');

    const validationError = validateDevisInput(data);
    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError }),
      };
    }

    const safeClientName = escapeHtml(data.clientName);
    const safeService = escapeHtml(data.service);

    // Generate prestations table HTML with escaped names
    const prestationsHTML = data.prestations
      .filter((p) => p.nom)
      .map(
        (p) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">${escapeHtml(p.nom)}</td>
          <td style="padding: 12px; text-align: center;">${p.quantite}</td>
          <td style="padding: 12px; text-align: right;">${p.prix_unitaire.toFixed(2)}€</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">${(p.quantite * p.prix_unitaire).toFixed(2)}€</td>
        </tr>
      `
      )
      .join('');

    // Send devis email to client
    await resend.emails.send({
      from: 'SMSBeauty <contact@weddingbysms.fr>',
      to: data.clientEmail,
      subject: `Votre devis SMSBeauty pour ${safeService}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #333;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #c19a6b;">
            <h1 style="color: #c19a6b; margin: 0;">DEVIS</h1>
            <p style="color: #666; margin: 5px 0 0 0;">SMSBeauty</p>
          </div>

          <div style="padding: 20px 0;">
            <p style="margin: 0 0 20px 0;">
              Cher <strong>${safeClientName}</strong>,
            </p>
            <p style="color: #666; margin: 0 0 20px 0; line-height: 1.6;">
              Nous vous remercions de votre demande. Veuillez trouver ci-dessous le devis détaillé pour votre service <strong>${safeService}</strong>.
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
            <thead>
              <tr style="background: #f0f0f0; border-bottom: 2px solid #c19a6b;">
                <th style="padding: 12px; text-align: left; color: #c19a6b; font-weight: bold;">Prestation</th>
                <th style="padding: 12px; text-align: center; color: #c19a6b; font-weight: bold;">Quantité</th>
                <th style="padding: 12px; text-align: right; color: #c19a6b; font-weight: bold;">Prix unitaire</th>
                <th style="padding: 12px; text-align: right; color: #c19a6b; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${prestationsHTML}
            </tbody>
            <tfoot>
              <tr style="background: #f9f9f9;">
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #333;">TOTAL:</td>
                <td style="padding: 15px; text-align: right; font-size: 18px; font-weight: bold; color: #c19a6b;">
                  ${data.total.toFixed(2)}€
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong>Conditions générales :</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 13px;">
              <li>Devis valable 30 jours</li>
              <li>Acompte de 30% à la réservation</li>
              <li>Solde avant la date de l'événement</li>
              <li>Conditions de paiement : virement bancaire ou chèque</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; margin: 0 0 15px 0;">
              Pour toute question ou modification, n'hésitez pas à nous contacter.
            </p>
            <p style="margin: 0;">
              <a href="mailto:contact@weddingbysms.fr" style="color: #c19a6b; text-decoration: none; font-weight: bold;">
                contact@weddingbysms.fr
              </a>
            </p>
          </div>

          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
            <p style="margin: 0;">L'équipe SMSBeauty</p>
            <p style="margin: 5px 0 0 0;">Hyères et Var</p>
          </div>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Devis sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending devis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send devis',
      }),
    };
  }
};

export { handler };
