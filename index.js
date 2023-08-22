const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();
const path = require('path');
const router = express.Router();

// upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Rota para exibir o formulário
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contato.html'));
});

// Rota para enviar o e-mail
router.post('/send-mail', upload.single('attachment'), (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vadriano@magnasistemas.com.br',
      pass: 'czbzrufdqsyxpvvh',
    },
  });

  const mailOptions = {
    from: 'vadriano@magnasistemas.com.br',
    to: req.body.recipient,
    subject: req.body.topic,
    text: req.body.message,
    attachments: req.file ? [{ filename: req.file.originalname, content: req.file.buffer }] : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Não foi possivel enviar o e-mail:', error);
      res.send('Não foi possivel enviar o e-mail');
    } else {
      console.log('E-mail enviado:', info.response);
      res.redirect("/");
    }
  });
});

//carregando imagens e css 
app.use(express.static(__dirname));
//rota padrao da pagina
app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`servidor rodando na porta: ${PORT}`);
});
