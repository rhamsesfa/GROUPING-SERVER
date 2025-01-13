  const mongoose = require("mongoose"); 

const AnnouncementSchema = mongoose.Schema({
    
    startCity: {type: String}, 
    endCity: {type: String}, 
    startCity2: {type: Object}, 
    endCity2: {type: Object}, 
    dateOfDeparture: {type: Date}, 
    kilosCount: {type: Number}, 
    kiloPrice: {type : Number }, 
    company: {type: String}, 
    description: {type: String}, 
    pieds: {type: Number},
    userId: {type: String}, 
    draft: {type: Array},
    status: {type: String}, 
    date: {type: Date}, 
    active: {type: Boolean},
    priceKilo: {type: String, default: null},
    coords: {type: Object, default: null},
    locked: {type: Boolean, default: null}, 
    views: {type: Number}, 
    
    
})

AnnouncementSchema.pre('save', function(next) {
    if (this.kiloPrice && typeof this.kiloPrice === 'string') {
        // Remplacer la virgule par un point
        this.kiloPrice = parseFloat(this.kiloPrice.replace(',', '.'));
    }
    next();
});


module.exports = mongoose.model("Announcement", AnnouncementSchema); 