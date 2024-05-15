const mongoose = require("mongoose"); 

const AnnouncementSchema = mongoose.Schema({
    
    startCity: {type: String}, 
    endCity: {type: String}, 
    dateOfDeparture: {type: Date}, 
    kilosCount: {type: Number}, 
    kiloPrice: {type : Number}, 
    company: {type: String}, 
    description: {type: String}, 
    userId: {type: String}, 
    draft: {type: Array},
    status: {type: String}, 
    date: {type: Date}, 
    active: {type: Boolean}
})


module.exports = mongoose.model("Announcement", AnnouncementSchema); 