import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface DevisData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data: DevisData = JSON.parse(event.body || '{}');

    if (!data.email || !data.name || !data.service) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Send confirmation email to client
    await resend.emails.send({
      from: 'SMSBeauty <contact@smsbeauty.fr>',
      to: data.email,
      subject: 'Nous avons reçu votre demande',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #c19a6b; margin-bottom: 10px;">Merci ${data.name}!</h1>
          <p style="color: #666; margin: 0 0 20px 0;">Nous avons bien reçu votre demande.</p>
          <p style="color: #666;">Notre équipe vous contactera dans les plus brefs délais pour discuter de votre projet.</p>

          <hr style="border: none; border-top: 2px solid #c19a6b; margin: 30px 0;">

          <p style="color: #c19a6b; font-weight: bold; font-size: 14px; margin: 0 0 15px 0;">DÉTAILS DE VOTRE DEMANDE:</p>

          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 8px 0; line-height: 1.6;">
              <strong>Nom:</strong> ${data.name}
            </p>
            <p style="margin: 8px 0; line-height: 1.6;">
              <strong>Email:</strong> ${data.email}
            </p>
            <p style="margin: 8px 0; line-height: 1.6;">
              <strong>Téléphone:</strong> ${data.phone || 'Non fourni'}
            </p>
            <p style="margin: 8px 0; line-height: 1.6;">
              <strong>Service:</strong> ${data.service}
            </p>
            <p style="margin: 8px 0; line-height: 1.6;">
              <strong>Message:</strong><br/>
              <span style="color: #666; font-style: italic;">${data.message.replace(/\n/g, '<br>')}</span>
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Cordialement,<br/>
            <strong style="color: #333;">L'équipe SMSBeauty</strong>
          </p>
        </div>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'SMSBeauty <contact@smsbeauty.fr>',
      to: 'contact@smsbeauty.fr',
      subject: `Nouvelle demande de devis: ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #c19a6b; margin-bottom: 10px;">📋 Nouvelle demande reçue</h2>
          <p style="color: #666; margin: 0 0 20px 0;">Une demande de devis a été soumise via le formulaire.</p>

          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0; line-height: 1.6;">
              <strong>Nom du client:</strong> ${data.name}
            </p>
            <p style="margin: 10px 0; line-height: 1.6;">
              <strong>Email:</strong> <a href="mailto:${data.email}" style="color: #c19a6b;">${data.email}</a>
            </p>
            <p style="margin: 10px 0; line-height: 1.6;">
              <strong>Téléphone:</strong> <a href="tel:${data.phone}" style="color: #c19a6b;">${data.phone || 'Non fourni'}</a>
            </p>
            <p style="margin: 10px 0; line-height: 1.6;">
              <strong>Service demandé:</strong> <span style="color: #c19a6b; font-weight: bold;">${data.service}</span>
            </p>
          </div>

          <p style="color: #666; margin: 20px 0 10px 0;"><strong>Message du client:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 3px solid #c19a6b; margin-bottom: 20px;">
            <p style="margin: 0; color: #555; white-space: pre-wrap; line-height: 1.6;">
              ${data.message}
            </p>
          </div>

          <hr style="border: none; border-top: 2px solid #c19a6b; margin: 30px 0;">

          <p style="text-align: center; margin-top: 20px;">
            <a href="${process.env.SUPABASE_URL || 'https://supabase.com'}/projects" style="display: inline-block; background: #c19a6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Accéder au panel admin
            </a>
          </p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
    };
  }
};

export { handler };
