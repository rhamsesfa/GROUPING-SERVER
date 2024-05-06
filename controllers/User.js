const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  service: 'gmail',
    auth: {
        user: 'groupingsa@gmail.com',
        pass: 'Grouping@2024'
    }
});
  
  
  const mailOptions = {
  from: 'groupingsa@gmail.com',
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
 
 exports.signInWithGoogle = (req, res) => {
   
     User.findOne({
       email: req.body.email
     }).then((user) => {
       
       if(user){
         
         
       }else{
         
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = User({
              email: req.body.email,
              name: req.body.name,
              password: hash,
              date: new Date(),
              photo: req.body.photo
            });

            const _id = await newUser.save().then(async (uss) => {
              return uss._id;
            });
            
       
            User.findOne({_id}).then((use) => {
              
              delete use._id
              
              res.status(201).json({
              status: 0,
              user: use,
              message: "Utilisateur ajouté avec succès",
              token: jwt.sign(
                { userId: _id },
                "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
              ),
            });
                
            }, (err) => {
              
                res.status(505).json({ err });
            })


          },
          (err) => {
            res.status(505).json({ err });
          }
        );
           
       }
         
     }, (err) => {
       
         res.status(505).json({err})
     })
 }
 
exports.signUpp = (req, res) => {
  
    
    User.findOne({email: req.body.email}).then((user) => {
      
          if(user) {
            
              res.status(201).json({ status: 1, message: "Adresse déjà utilisée"});
              
          }else{
            
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = User({
              email: req.body.email,
              name: req.body.name,
              password: hash,
              date: new Date(),
            });

            const _id = await newUser.save().then(async (uss) => {
              return uss._id;
            });
            
       
            User.findOne({_id}).then((use) => {
              
              delete use._id
              
              res.status(201).json({
              status: 0,
              user: use,
              message: "Utilisateur ajouté avec succès",
              token: jwt.sign(
                { userId: _id },
                "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
              ),
            });
                
            }, (err) => {
              
                res.status(505).json({ err });
            })

          },
          (err) => {
            res.status(505).json({ err });
          }
        );
              
          }
    })
}

exports.Register = (req, res) => {
  
  console.log(req.body); 
  const code = genererCode();
  
  User.findOne({ email: req.body.email }).then(
    (user) => {
      
      if (user) {
     
        res.status(201).json({ status: 1, message: "Adresse déjà utilisée"});
      
      } else {

            
            res.status(201).json({
              status: 0,
              message: "Email clean",
              code
           
            });
       
      }
    },
    (err) => {
      console.log(err);
      res.status(500).json({ err });
    }
  );
};


exports.signUp = (req, res) => {
  
  
  
  User.findOne({ phone: req.body.email }).then(
    (user) => {
      if (user) {
        res.status(201).json({ status: 1, message: "Adresse déjà utilisée" });
      } else {
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = User({
              email: req.body.email,
              name: req.body.name,
              password: hash,
              date: new Date(),
            });

            const _id = await newUser.save().then(async (uss) => {
              return uss._id;
            });
            
       

            res.status(201).json({
              status: 0,
              message: "Utilisateur ajouté avec succès",
              token: jwt.sign(
                { userId: _id },
                "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
              ),
            });
          },
          (err) => {
            res.status(505).json({ err });
          }
        );
      }
    },
    (err) => {
      res.status(505).json({ err });
    }
  );
};
