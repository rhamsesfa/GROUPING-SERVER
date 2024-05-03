const mongoose = require("mongoose"); 

const userSchema = mongoose.Schema({
  
    name: {type: String}, 
    email: {type: String}, 
    password: {type: String},
    code: {type: String}, 
    date: {type: Date}
  
})


module.exports = mongoose.model("User", userSchema); 