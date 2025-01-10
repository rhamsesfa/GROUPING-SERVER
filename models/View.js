const mongoose = require("mongoose"); 

const viewSchema = mongoose.Schema({
    
    phoneId: {type: String}, 
    date: {type: Date}, 
    announcementId: {type: String}
    
})


module.exports = mongoose.model("View", viewSchema);