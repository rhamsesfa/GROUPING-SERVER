const Announcement = require("../models/Announcement"); 


exports.addAnnouncement = (req, res) => {
  
  if(req.body.status === "kilos"){
    
        const announcement = new Announcement({
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDeparture: req.body.date, 
        kilosCount: req.body.kilosCount, 
        kilosPrice: req.body.kilosPrice, 
        company: req.body.company, 
        description: req.body.description, 
        userId: req.auth.userId, 
        status: req.body.status, 
        date: new Date(), 
        active: false
    })
    
    announcement.save().then(() => {
      
      res.status(201).json({status: 0});
        
    }, (err) => {
      
        console.log(err); 
      res.status(505).json({err})
    })
    
    
  }else{
    
    
  }
  

}