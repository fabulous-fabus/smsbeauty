const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: '.env.server' });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, date, guests, city, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    // Email à l'admin
    await transporter.sendMail({
      from: `"Wedding by SMS" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle demande de devis : ${service}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p>
        <p><strong>Service :</strong> ${service}</p>
        <p><strong>Date de l'événement :</strong> ${date || 'Non précisée'}</p>
        <p><strong>Nombre de personnes :</strong> ${guests || 'Non précisé'}</p>
        <p><strong>Ville :</strong> ${city || 'Non précisée'}</p>
        <p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Email de confirmation au client
    await transporter.sendMail({
      from: `"Wedding by SMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Nous avons bien reçu votre demande',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #c19a6b; background-color: #1c1c1c;">
            <p style="margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 3px; color: #fff; padding: 20px 40px; display: inline-block;">
              <span style="color: #c19a6b; margin-right: 10px;">✦</span>Wedding by <span style="color: #c19a6b;">SMS</span>
            </p>
          </div>
          <div style="padding: 30px 0;">
            <p>Cher(e) <strong>${name}</strong>,</p>
            <p>Nous avons bien reçu votre demande pour <strong>${service}</strong>.</p>
            <p>Notre équipe vous contactera dans les plus brefs délais.</p>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; color: #999; font-size: 13px;">
            <p style="margin: 0;">Cordialement,</p>
            <p style="margin: 4px 0 0 0; color: #c19a6b; font-weight: bold;">L'équipe Wedding by SMS</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    res.status(500).json({ error: 'Erreur envoi email' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur port ${PORT}`));
