const mongoose = require("mongoose"); 

const citySchema = mongoose.Schema({
    name: {type: String}, 
    country: {type: String}, 
    code: {type: String}, 
    country_id: {type: String}
})

module.exports = mongoose.model("City", citySchema);