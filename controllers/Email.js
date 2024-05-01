const nodemailer = require('nodemailer');

function genererCode() {
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
  subject: 'Réinitialisation de mot de passe',
  text: `Réinitialisé votre mot de passe en suivant le lien : https://chronicklpaid.glitch.me/newpass/?token=${email}`
};
  
  
  
}