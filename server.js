const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();


const corsOptions = {
  // origin: 'https://botongsign.com', 
  // methods: 'POST',
  // credentials: true, // Permitir cookies

  origin: '*',
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']

};



app.use(cors(corsOptions));

app.options('*', cors());

app.options('*', (req, res) => {
  res.sendStatus(200);
});


app.use(bodyParser.json());


// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.dondominio.com', 
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODemailer_USER, 
    pass: process.env.NODemailer_PASS,
  },
});

app.use((req, res, next) => {
  console.log('CORS headers:', res.getHeaders());
  next();
});

app.post('/send-email', (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: 'contacto@botongsign.com',
    to: 'contacto@botongsign.com', 
    subject: `Nueva consulta de ${name}`,
    text: `
      Nombre: ${name}
      Correo: ${email}
      Teléfono: ${phone}
      Mensaje: ${message}
    `,
    replyTo: email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error al enviar el correo. Vuelve a intentarlo más tarde.', error); 
      return res.status(500).send(error.toString());
  
    }
    res.status(200).send({ message: 'Tu correo se ha enviado. Gracias por contactar.' });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});


module.exports = app;