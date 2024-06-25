const Announcement = require("../models/Announcement"); 
const City = require("../models/City");

exports.addAnnouncementWithPdf = (req, res) => {
  
 
      const draft = [`${req.protocol}s://${req.get("host")}/pdf_documents/${req.file.filename}`]; 
  
       const announcement = new Announcement({
       
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDeparture: req.body.date, 
        draft,
        pieds: req.body.pieds,
        description: req.body.description, 
        userId: req.auth.userId, 
        status: "container", 
        date: new Date(), 
        active: false
        
    })
       
    announcement.save().then(() => {
      
      res.status(201).json({status: 0});
        
    }, (err) => {
      
        console.log(err); 
      res.status(505).json({err})
    })
      
  
}


exports.addAnnouncementWithImages = (req, res) => {
  
      console.log(req.files); 
      console.log(req.body); 
  
      let draft = []; 
  
      for(let file of req.files){
        
          draft.push(`${req.protocol}s://${req.get("host")}/images/${file.filename}`)
      }
  
       const announcement = new Announcement({
       
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDeparture: req.body.date, 
        draft,
        pieds: req.body.pieds,
        description: req.body.description, 
        userId: req.auth.userId, 
        status: "container", 
        date: new Date(), 
        active: false
        
    })
       
    announcement.save().then(() => {
      
      res.status(201).json({status: 0});
        
    }, (err) => {
      
        console.log(err); 
      res.status(505).json({err})
    })
  
      
}



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
        active: true
        
    })
    
    announcement.save().then(() => {
      
      res.status(201).json({status: 0});
        
    }, (err) => {
      
        console.log(err); 
      res.status(505).json({err})
    })
    
    
  }else{
    
    console.log(req.body); 
    console.log(req.file);
    
  }
  

}

exports.getAnnouncementsById = (req, res) => {
  
  
  Announcement.find({userId: req.auth.userId, active: true}).then((annonces) => {
    
    res.status(200).json({annonces, status: 0}); 
      
  }, (err) => {
    
      res.status(500).json({err})
  })
    
}

exports.getAnnonces = (req, res) => {
  
    Announcement.find({active: true, status: "container"}).sort({date: -1}).limit(6).then( (containers) => {
      
      Announcement.find({active: true, status: "kilos"}).sort({date: -1}).limit(6).then(async (kilos) => {
        
        
            for(let container of containers) {
            
              container.startCity2 = await City.findOne({name: container.startCity }); 
              container.endCity2 =  await City.findOne({name: container.endCity })
          }
        
          for(let kilo of kilos) {
            
              kilo.startCity2 = await City.findOne({name: kilo.startCity }); 
              kilo.endCity2 =  await City.findOne({name: kilo.endCity })
          }
        
          res.status(201).json({status: 0, kilos, containers});
        
          
      }, (err) => {
        
          res.status(500).json({err})
      })
      

    
    
    }, (err) => {
      
        res.status(500).json({err})
    })
}