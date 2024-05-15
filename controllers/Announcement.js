const Announcement = require("../models/Announcement"); 


exports.addAnnouncement = (req, res) => {
  
    const announcement = new Announcement({
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDe
    })
}