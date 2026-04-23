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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #c19a6b;">Merci ${data.name}!</h1>
          <p>Nous avons bien reçu votre demande pour <strong>${data.service}</strong>.</p>
          <p>Notre équipe vous contactera dans les plus brefs délais pour discuter de votre projet.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p><strong>Détails de votre demande:</strong></p>
          <ul>
            <li><strong>Service:</strong> ${data.service}</li>
            <li><strong>Téléphone:</strong> ${data.phone || 'Non fourni'}</li>
            <li><strong>Message:</strong> ${data.message}</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p>Cordialement,<br/><strong>L'équipe SMSBeauty</strong></p>
        </div>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'SMSBeauty <contact@smsbeauty.fr>',
      to: 'contact@smsbeauty.fr',
      subject: `Nouvelle demande de devis: ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c19a6b;">Nouvelle demande reçue</h2>
          <p><strong>Client:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Service demandé:</strong> ${data.service}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p><a href="${process.env.SUPABASE_URL || 'https://supabase.com'}" style="color: #c19a6b;">Accéder au tableau de bord</a></p>
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
