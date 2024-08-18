const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Email Sender API is running');
});

// Route to send an email
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate request
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Please provide to, subject, and either text or html content' });
  }

  try {
    // Configure the email transport using nodemailer
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // you can use other services like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    let mailOptions = {
      
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
      
    }

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

({
  "to": "devcloud278@gmail.com",
  "subject": "Test Email",
  "text": "This is a test email message.",
  "html": "<h1>This Emai send for notification.</h1>"
});

