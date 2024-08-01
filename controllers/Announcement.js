const Announcement = require("../models/Announcement"); 
const City = require("../models/City");

exports.addAnnouncementWithPdf = (req, res) => {
  
 
      const draft = [`${req.protocol}s://${req.get("host")}/pdf_documents/${req.file.filename}`]; 
  
   const dateOfDeparture = new Date(req.body.dateOfDeparture);
  
       const announcement = new Announcement({
       
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDeparture: dateOfDeparture, 
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
  
     // console.log(req.files); 
      console.log(req.body); 
  
      let draft = []; 
  
      for(let file of req.files){
        
          draft.push(`${req.protocol}s://${req.get("host")}/images/${file.filename}`)
      }
  
  const dateOfDeparture = new Date(req.body.dateOfDeparture);
  
       const announcement = new Announcement({
       
        startCity: req.body.startCity, 
        endCity: req.body.endCity, 
        dateOfDeparture: dateOfDeparture, 
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
  if (req.body.status === "kilos") {
    console.log("la dix", req.body);

    // Convertir dateOfDeparture en objet Date
    const dateOfDeparture = new Date(req.body.dateOfDeparture);

    const announcement = new Announcement({
      startCity: req.body.startCity,
      endCity: req.body.endCity,
      startCity2: req.body.startCity2,
      endCity2: req.body.endCity2,
      dateOfDeparture: dateOfDeparture, // Convertir en Date
      kilosCount: req.body.kilosCount,
      kiloPrice: req.body.kiloPrice,
      company: req.body.company,
      description: req.body.description,
      pieds: req.body.pieds,
      userId: req.auth.userId,
      status: req.body.status,
      date: new Date(), // Date actuelle
      active: req.body.active || true, // Par défaut à true si non fourni
      priceKilo: req.body.priceKilo || null // Par défaut à null si non fourni
    });

    announcement.save()
      .then(() => {
        res.status(201).json({ status: 0 });
      })
      .catch((err) => {
        console.error("Erreur lors de la sauvegarde de l'annonce:", err);
        res.status(500).json({ error: err.message });
      });
  } else {
    console.log(req.body);
    console.log(req.file);
  }
};


exports.getAnnouncementsById = async (req, res) => {
  
  console.log("On commence");
  
  
  try {
    
    const containers = await Announcement.find({userId: req.auth.userId, active: true, status: "container"}).sort({date: -1}).limit(6); 
    const kilos = await Announcement.find({userId: req.auth.userId, active: true, status: "kilos"}).sort({date: -1}).limit(6); 
    
  
          for(let container of containers) {
            
              container.startCity2 = await City.findOne({name: container.startCity }); 
              container.endCity2 =  await City.findOne({name: container.endCity })
          }
        
          for(let kilo of kilos) {
            
              kilo.startCity2 = await City.findOne({name: kilo.startCity }); 
              kilo.endCity2 =  await City.findOne({name: kilo.endCity })
          }
    
    res.status(200).json({status: 0, kilos, containers, startAt: containers.length == 6 ?  6 : null, 
                         startBt: kilos.length == 6 ?  6 : null})
    
    
  }catch(err){
    
      console.log(err); 
      res.status(505).json({err})
  }
    
}

exports.moreAnnouncements = async (req, res) => {
  
  console.log(req.body);
  
    try{
      
      const annonces = await Announcement.find({userId: req.auth.userId, active: true, status: req.body.status}).sort({date: -1})
      .skip(req.body.skip).limit(6); 
      
      if(req.body.status === "kilos"){
        
            for(let kilo of annonces) {
            
              kilo.startCity2 = await City.findOne({name: kilo.startCity }); 
              kilo.endCity2 =  await City.findOne({name: kilo.endCity })
          }
          
      }else{
        
          for(let container of annonces) {
            
              container.startCity2 = await City.findOne({name: container.startCity }); 
              container.endCity2 =  await City.findOne({name: container.endCity })
          }
      }
      
      
      res.status(200).json({status: 0, annonces, skip: annonces.length === 6 ? parseInt(req.body.skip) + 6 : null, z:annonces.length })
      
      
    }catch(e){
      
      console.log(e); 
      res.status(505).son({e})
    }
}

exports.getAnnonces = (req, res) => {
  
  const currentDate = new Date(); 
  
    Announcement.find({active: true, status: "container", dateOfDeparture: {$gte: currentDate}}).sort({date: -1}).limit(req.body.three ? 3 : 6).then( (containers) => {
      
      Announcement.find({active: true, status: "kilos",  dateOfDeparture: {$gte: currentDate}}).sort({date: -1}).limit(req.body.three ? 3 : 6).then(async (kilos) => {
        
        
            for(let container of containers) {
            
              container.startCity2 = await City.findOne({name: container.startCity }); 
              container.endCity2 =  await City.findOne({name: container.endCity })
          }
        
          for(let kilo of kilos) {
            
              kilo.startCity2 = await City.findOne({name: kilo.startCity }); 
              kilo.endCity2 =  await City.findOne({name: kilo.endCity })
          }
         // console.log(kilos)
        
        
          res.status(201).json({status: 0, kilos, containers});
        
          
      }, (err) => {
        
          res.status(500).json({err})
      })
      

    
    
    }, (err) => {
      
        res.status(500).json({err})
    })
}