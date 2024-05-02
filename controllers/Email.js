const nodemailer = require('nodemailer');

 const  genererCode = () => {
    var code = "";
    for (var i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10); // Générer un chiffre aléatoire entre 0 et 9
    }
    return code;
}
 const sendEmail = (email) => {
  
  const code = genererCode(); 
  
  const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", 
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: 'chronicklresetpass@outlook.fr',
    //pass: 'rwhpljusybnoqzog'
    //gmail jcfbbzobraalhbmn
    pass: "chronickl@2023!"
  }, 
 // host: 'smtp.mail.yahoo.com',
  //port: 465,
  //secure: true
});
  
  
  const mailOptions = {
  from: 'chronicklresetpass@outlook.fr',
  to: email,
  subject: 'Grouping: Validation d\'adresse email',
  html: `
    
    <html>  
       <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
            }
            p {
              color: #666;
            }
          </style>
        </head>
         <body>
          <div class="container">
            <h1>Validation par code OTP</h1>
            <p>Veuillez saisir le code ci-dessous dans l'application Grouping pour valider votre adresse email :</p>
            <h2>${code}</h2>
          </div>
        </body>
    </html>
  
  `
};
   
          transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            
            return false
           
          } else {
            console.log('Email sent: ' + info.response);
           return true
          }
        });
  
  
  
}
 
 module.export = sendEmail;