const mongoose = require("mongoose"); 

const viewSchema = mongoose.Schema({
    
    userId: {type: String}, 
    date: {type: Date}, 
    announcementId: {type: String}
    
})


module.exports = mongoose.model("View", viewSchema);