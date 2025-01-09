const mongoose = require("mongoose"); 

const viewSchema = mongoose.Schema({
    
    userId: {type: String}, 
    date: {type: Date}
    
})


module.exports = mongoose.model("View", viewSchema);