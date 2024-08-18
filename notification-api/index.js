const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Notification API is running');
});

// Route to send a notification
app.post('/send-notification', async (req, res) => {
  const { email, subject, message } = req.body;

  // Validate request
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Please provide email, subject, and message' });
  }

  try {
    // Configure the email transport using nodemailer
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // you can use other services like SendGrid, Mailgun, etc.
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    // Email options
    let mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: subject,
      text: message
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
