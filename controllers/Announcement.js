const Announcement = require("../models/Announcement"); 
const City = require("../models/City");
const User = require("../models/User")
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


exports.addAnnouncementWithPdf = (req, res) => {
  
 
  const draft = [`${req.protocol}s://${req.get("host")}/pdf_documents/${req.file.filename}`];
  console.log(draft);
  
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
      active: true,
      priceKilo: req.body.priceKilo || null, // Par défaut à null si non fourni
      coords: req.body.coords || null
    });

    announcement.save()
      .then(() => {
      
        res.status(201).json({ status: 0});
      
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

exports.getAnnonce = async (req, res) => {
  
    try{
        console.log(req.body)
      
        const annonce = await Announcement.findOne({_id: req.body.id}); 
      
        annonce.startCity2 = await City.findOne({name: annonce.startCity}); 
        annonce.endCity2 = await City.findOne({name: annonce.endCity})
      
        console.log(annonce); 
      
        const userObjectId = new ObjectId(annonce.userId);
      
        const user = await User.findOne({_id: annonce.userId});
      
        const sum = await Announcement.countDocuments({userId: user._id, active: true}); 
      
       
        res.status(200).json({status: 0, annonce, sum, user}); 
      
        
      
    }catch(e){
        
        console.log(e); 
      res.status(505).json({e})
    }
  

}

function monthNameToNumber(monthName) {
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const monthIndex = monthNames.indexOf(monthName.toLowerCase());
  return monthIndex >= 0 ? monthIndex + 1 : null;
}



exports.annoncesRecherche = async (req, res) => {
  
    console.log(req.body);
  
   // console.log(monthNameToNumber(req.body.month))
  
    let month = monthNameToNumber(req.body.month); 
    let year = req.body.year; 
  
    let startDate; 
  
  
      console.log ("le mois", new Date().getMonth())
  
      if(year === new Date().getFullYear() && (month - 1) === new Date().getMonth() ){
        
           startDate = new Date();
      
      }else{
        
             startDate = new Date(year, month - 1, 1);
      }
  
      
  
  
      const endDate = new Date(year, month, 1);
  
      
  
  
  try{
    
    const annoncesCount = await   Announcement.countDocuments({startCity: req.body.start, endCity: req.body.end, dateOfDeparture: {
      $gte: startDate,
      $lt: endDate
    }, status: req.body.type, active: true})
    
     const annonces= await   Announcement.find({startCity: req.body.start, endCity: req.body.end, dateOfDeparture: {
      $gte: startDate,
      $lt: endDate
    }, status: req.body.type, active: true}).sort({date: 1}).skip(req.body.startAt).limit(10);
    
      for(let kilo of annonces) {
            
              kilo.startCity2 = await City.findOne({name: kilo.startCity }); 
              kilo.endCity2 =  await City.findOne({name: kilo.endCity })
          }
    
    res.status(200).json({status: 0, annonces, count: annoncesCount, startAt: annonces.length === 10 ? parseInt(req.body.startAt) + 10 : null})
    
   console.log(annonces);
    
  }catch(e){
    
      console.log(e); 
    res.status(505).json({e})
  }
  
  
    
}