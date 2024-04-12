const mongoose = require("mongoose"); 

const citySchema = mongoose.Schema({
    name: {type: String}, 
    country: {type: String}, 
    code: {type: String}
})

module.exports = mongoose.model("City", citySchema);