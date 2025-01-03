const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const genererCode = () => {
  var code = "";
  for (var i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10); // Générer un chiffre aléatoire entre 0 et 9
  }
  return code;
};
const sendEmail = (email) => {
  const code = genererCode();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "groupingsa@gmail.com",
      pass: "Grouping@2024",
    },
  });

  const mailOptions = {
    from: "groupingsa@gmail.com",
    to: email,
    subject: "Grouping: Validation d'adresse email",
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
  
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

exports.signInWithGoogle = (req, res) => {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
  }).then(
    (user) => {
      if (user) {
        //delete user._id

        res.status(201).json({
          status: 1,
          user: user,
          message: "Utilisateur connecté avec succès",
          token: jwt.sign(
            { userId: user._id },
            "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
          ),
        });
      } else {
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = User({
              email: req.body.email,
              name: req.body.name,
              password: hash,
              date: new Date(),
              photo: req.body.photo,
            });

            const _id = await newUser.save().then(async (uss) => {
              return uss._id;
            });

            User.findOne({ _id }).then(
              (use) => {
                delete use._id;

                res.status(201).json({
                  status: 0,
                  user: use,
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

exports.signInWithGoogleAdmin = (req, res) => {
  console.log(req.body);

  // Recherche de l'utilisateur par email
  User.findOne({ email: req.body.email }).then(
    (user) => {
      // Si l'utilisateur existe
      if (user) {
        // Vérification du rôle dans l'objet utilisateur
        const allowedRoles = ["superUser", "admin1", "admin2"];

        if (
          req.body.typeconnexion === "admin" &&
          (!user.role || !allowedRoles.includes(user.role))
        ) {
          return res.status(201).json({
            status: 0,
            message: "Accès non autorisé pour ce rôle.",
          });
        }

        // Si le rôle est valide ou si typeconnexion n'est pas "admin"
        res.status(201).json({
          status: 1,
          user: user,
          message: "Utilisateur connecté avec succès",
          token: jwt.sign(
            { userId: user._id },
            "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
          ),
        });
      } else {
        // Si typeconnexion est "admin" et l'utilisateur n'existe pas
        if (req.body.typeconnexion === "admin") {
          return res.status(201).json({
            status: 0,
            message: "Utilisateur non autorisé.",
          });
        }

        // Création d'un nouvel utilisateur si typeconnexion n'est pas "admin"
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = new User({
              email: req.body.email,
              name: req.body.name,
              password: hash,
              date: new Date(),
              photo: req.body.photo,
            });

            const _id = await newUser.save().then(async (uss) => {
              return uss._id;
            });

            User.findOne({ _id }).then(
              (use) => {
                delete use._id;

                res.status(201).json({
                  status: 0,
                  user: use,
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

exports.signUpp = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
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

          User.findOne({ _id }).then(
            (use) => {
              delete use.password;

              res.status(201).json({
                status: 0,
                user: use,
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
        },
        (err) => {
          res.status(505).json({ err });
        }
      );
    }
  });
};

exports.Register = (req, res) => {
  console.log(req.body);
  const code = genererCode();

  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (user) {
        res.status(201).json({ status: 1, message: "Adresse déjà utilisée" });
      } else {
        res.status(201).json({
          status: 0,
          message: "Email clean",
          code,
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

exports.signIn = (req, res) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        res.status(200).json({
          status: 1,
          message: "Utilisateur et/ou mot de passe incorrect",
        });
      } else {
        bcrypt.compare(req.body.password, user.password).then(
          (valid) => {
            if (!valid) {
              res.status(200).json({
                status: 1,
                message: "Utilisateur et/ou mot de passe incorrect",
              });
            } else {
              const _id = user._id;

              delete user._id;

              res.status(200).json({
                status: 0,
                user,
                token: jwt.sign(
                  { userId: _id },
                  "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
                ),
              });
            }
          },
          (err) => {
            console.log(err);
            res.status(505).json({ err });
          }
        );
      }
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.appleInfo = (req, res) => {
  console.log(req.body);
  res.status(201).json({ status: 0, message: "Thank You!" });
};
