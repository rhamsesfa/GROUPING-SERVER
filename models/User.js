const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  code: { type: String },
  date: { type: Date },
  active: { type: Boolean },
  photo: { type: String },
  role: { type: String, default: null }, // Attribut 'role' ajouté
  locked: { type: Boolean, default: false }, //propriété permettant de savoir si un user a été bloqué ou pas
});

module.exports = mongoose.model("User", userSchema);