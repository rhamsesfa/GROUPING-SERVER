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
});

module.exports = mongoose.model("User", userSchema);