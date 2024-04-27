const mongoose = require("mongoose"); 

const countrySchema = mongoose.Schema({
    name: {type: String}, 
    
})

module.exports = mongoose.model("Country", countrySchema);