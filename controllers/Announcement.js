const Announcement = require("../models/Announcement"); 
const City = require("../models/City");
const User = require("../models/User")
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const View = require("../models/View"); 


exports.avoirLesAnnonces = async (req, res) => {
    
    const startAt = req.body.startAt ? req.body.startAt : 0;
  
    try{
        
      const annonces = await Announcement.find({
         active: true,  
         status: req.body.status === "c" ? "container" : "kilos",
         dateOfDeparture: {$gte: new Date()}
      })
      .sort({date: -1})
      .startAt(startAt)
      .limit(10); 
      
      
       const cityNames = [
      ...new Set([...annonces.map(c => c.startCity), ...annonces.map(c => c.endCity),])
    ];
    
    const cities = await City.find({ name: { $in: cityNames } });
    const cityMap = new Map(cities.map(city => [city.name, city]));

    // Ajouter les informations de ville aux conteneurs et kilos
    annonces.forEach(annonce => {
      annonce.startCity2 = cityMap.get(annonce.startCity);
      annonce.endCity2 = cityMap.get(annonce.endCity);
    });
    
  
    res.status(200).json({status: 0, annonces, startAt: annonces.length === 10 ?  })
      
      
      
    }catch(err){
      
        console.log(err); 
        res.status(505).json({err})
    }
}

/*
exports.addAnnouncementWithPdf = (req, res) => {
  
 
  const draft = [`${req.protocol}s://${req.get("host")}/pdf_documents/${req.file.filename}`];
  //console.log(draft);
  
   const dateOfDeparture = new Date(req.body.dateOfDeparture);  
  // Conversion de coords en objet JSON
  const coords = req.body.coords ? JSON.parse(req.body.coords) : null;
  
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
        active: false,
        coords: coords
    })
       
    announcement.save().then(() => {
      
      res.status(201).json({status: 0});
        
    }, (err) => {
      
        console.log(err); 
      res.status(505).json({err})
    })
      
  
}


exports.addAnnouncementWithImages = (req, res) => {
       // Vérification que req.files existe et est un tableau
    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
  
     // console.log(req.files); 
      //console.log(req.body); 
  
      let draft = []; 
  
      for(let file of req.files){
        
          draft.push(`${req.protocol}s://${req.get("host")}/images/${file.filename}`)
      }
  
  const dateOfDeparture = new Date(req.body.dateOfDeparture);
  // Conversion de coords en objet JSON
  const coords = req.body.coords ? JSON.parse(req.body.coords) : null;
  
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
        active: false,
        coords: coords
        
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
    
    //console.log("la dix", req.body);

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
}; */


exports.getAnnouncementsById = async (req, res) => {
  
  //console.log("On commence");
  
  
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
  
  //console.log(req.body);
  
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

exports.getAnnoncess = async (req, res) => {
  try {
    const currentDate = new Date(); 
    const limit = req.body.three ? 3 : 60;
    //console.log("Current Date:", currentDate);
    
    // Récupérer les annonces de conteneurs et de kilos
    const containers = await Announcement.find({
      active: true,
      status: "container",
      dateOfDeparture: { $gte: currentDate }
    }).sort({ date: 1 }).limit(limit);
    
    //console.log("Containers found:", containers.length);
    
    const kilos = await Announcement.find({
      active: true,
      status: "kilos",
      dateOfDeparture: { $gte: currentDate }
    }).sort({ date: -1 }).limit(limit);
    
    // Récupérer toutes les villes nécessaires
    const cityNames = [
      ...new Set([...containers.map(c => c.startCity), ...containers.map(c => c.endCity),
                  ...kilos.map(k => k.startCity), ...kilos.map(k => k.endCity)])
    ];
    
    const cities = await City.find({ name: { $in: cityNames } });
    const cityMap = new Map(cities.map(city => [city.name, city]));

    // Ajouter les informations de ville aux conteneurs et kilos
    containers.forEach(container => {
      container.startCity2 = cityMap.get(container.startCity);
      container.endCity2 = cityMap.get(container.endCity);
    });
    
    kilos.forEach(kilo => {
      kilo.startCity2 = cityMap.get(kilo.startCity);
      kilo.endCity2 = cityMap.get(kilo.endCity);
    });

    // Répondre avec les données traitées
    res.status(200).json({ status: 0, kilos, containers });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAnnoncee = async (req, res) => {
  
    try{
        //console.log(req.body)
      
      console.log("On se comprend");
      
        const annonce = await Announcement.findOne({_id: req.body.id}); 
      
     console.log(req.body.phoneId);
          
      const view = await View.findOne({announcementId: req.body.id, phoneId: req.body.phoneId}); 
      
        if(!view){
          
          
            const newView = new View({
              
                announcementId: req.body.id, 
                phoneId: req.body.phoneId, 
                date: new Date()
            })
            
           await  newView.save(); 
            
            Announcement.updateOne({_id: req.body.id}, {$set: {views: annonce.views ? parseInt(annonce.views) + 1 : 1 }}).then(() => {
             
             console.log("Tout s'est bien passé");
                 
           }, (err) => {
             
               console.log(err)
           })
          
          
      
          annonce.views = annonce.views ? annonce.views + 1 : 1;
          console.log("On a fait notre taff");
        }
      
            
        
      
       
    

      
        annonce.startCity2 = await City.findOne({name: annonce.startCity}); 
        annonce.endCity2 = await City.findOne({name: annonce.endCity})
      
        //console.log(annonce); 
      
        const userObjectId = new ObjectId(annonce.userId);
      
        const user = await User.findOne({_id: annonce.userId});
      
        const sum = await Announcement.countDocuments({userId: user._id, active: true}); 
      
       
        res.status(200).json({status: 0, annonce, sum, user}); 
      
        
      
    }catch(e){
        
        console.log(e); 
      res.status(505).json({e})
    }
  

}

/*function monthNameToNumber(monthName) {
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const monthIndex = monthNames.indexOf(monthName.toLowerCase());
  return monthIndex >= 0 ? monthIndex + 1 : null;
}

*/

exports.annoncesRecherche = async (req, res) => {
  
    //console.log(req.body);
  
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
    
   //console.log(annonces);
    
  }catch(e){
    
      console.log(e); 
    res.status(505).json({e})
  }
  
  
    
}

//version admin

exports.getValidAnnouncements = async (req, res) => {
  try {
    // Récupérer la date actuelle
    const currentDate = new Date();

    // Trouver toutes les annonces avec une date de départ valide
    const validAnnouncements = await Announcement.find({
      dateOfDeparture: { $gt: currentDate }, // Filtrer les annonces avec une date de départ future
    });

    res.status(200).json({
      status: 0,
      announcements: validAnnouncements,
      message: "Annonces valides récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces valides :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces valides",
      error,
    });
  }
};

exports.getFalseContainer = async (req, res) => {
  try {
    const currentDate = new Date(); // Date actuelle

    // Récupérer les annonces avec status "container", active à false, et date de départ valide
    const inactiveContainers = await Announcement.find({
      status: "container",
      active: false,
      dateOfDeparture: { $gt: currentDate }, // Vérifie que la date est future
    });

    res.status(200).json({
      status: 0,
      announcements: inactiveContainers,
      message: "Annonces inactives 'container' avec des dates valides récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces inactives :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces inactives",
      error,
    });
  }
};

exports.getFalseKilo = async (req, res) => {
  try {
    const currentDate = new Date(); // Date actuelle

    // Récupérer les annonces avec status "kilos", active à false, et date de départ valide
    const inactiveKilo = await Announcement.find({
      status: "kilos",
      active: false,
      dateOfDeparture: { $gt: currentDate }, // Vérifie que la date est future
    });

    res.status(200).json({
      status: 0,
      announcements: inactiveKilo,
      message: "Annonces inactives 'kilos' avec des dates valides récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces inactives :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces inactives",
      error,
    });
  }
};


exports.getConversionRate = async (req, res) => {
  try {
    // Récupérer le nombre total d'utilisateurs
    const totalUsers = await User.countDocuments();

    // Récupérer le nombre d'utilisateurs ayant posté au moins une annonce
    const usersWithAnnouncements = await Announcement.distinct("userId");

    // Calculer le taux de conversion
    const conversionRate = totalUsers > 0 
      ? ((usersWithAnnouncements.length / totalUsers) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      status: 0,
      conversionRate: `${conversionRate}`,
      totalUsers,
      usersWithAnnouncements: usersWithAnnouncements.length,
      message: "Taux de conversion calculé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du calcul du taux de conversion :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors du calcul du taux de conversion",
      error,
    });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.body;

    // Vérifier si l'ID est fourni
    if (!id) {
      return res.status(400).json({
        status: 1,
        message: "L'identifiant de l'annonce est requis.",
      });
    }

    // Utiliser `findByIdAndUpdate` pour réduire le nombre d'opérations
    const announcement = await Announcement.findById(id);

    // Vérifier si l'annonce existe
    if (!announcement) {
      return res.status(404).json({
        status: 1,
        message: "Annonce non trouvée.",
      });
    }

    const update = {};
    if (announcement.active) {
      // Si active est true, on le passe à false et on ajoute locked
      update.active = false;
      update.locked = true;
    } else {
      // Si active est false, on le passe à true et on retire locked
      update.active = true;
      update.$unset = { locked: "" }; // Utiliser $unset pour supprimer `locked`
    }

    // Appliquer les modifications
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      update,
      { new: true } // Retourner l'objet mis à jour
    );

    res.status(200).json({
      status: 0,
      message: "Statut 'active' mis à jour avec succès.",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut 'active' :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la mise à jour du statut 'active'.",
      error,
    });
  }
};



exports.addAnnouncementWithPdf = (req, res) => {
  const draft = [
    `${req.protocol}s://${req.get("host")}/pdf_documents/${req.file.filename}`,
  ];
  //console.log(draft);

  const dateOfDeparture = new Date(req.body.dateOfDeparture);
  // Conversion de coords en objet JSON
  const coords = req.body.coords ? JSON.parse(req.body.coords) : null;

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
    active: false,
    coords: coords,
  });

  announcement.save().then(
    () => {
      res.status(201).json({ status: 0 });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.addAnnouncementWithImages = (req, res) => {
  // Vérification que req.files existe et est un tableau
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ error: "Aucun fichier téléchargé" });
  }

  // console.log(req.files);
  //console.log(req.body);

  let draft = [];

  for (let file of req.files) {
    draft.push(`${req.protocol}s://${req.get("host")}/images/${file.filename}`);
  }

  const dateOfDeparture = new Date(req.body.dateOfDeparture);
  // Conversion de coords en objet JSON
  const coords = req.body.coords ? JSON.parse(req.body.coords) : null;

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
    active: false,
    coords: coords,
  });

  announcement.save().then(
    () => {
      res.status(201).json({ status: 0 });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.addAnnouncement = (req, res) => {
  if (req.body.status === "kilos") {
    //console.log("la dix", req.body);

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
      coords: req.body.coords || null,
    });

    announcement
      .save()
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
  //console.log("On commence");

  try {
    const containers = await Announcement.find({
      userId: req.auth.userId,
      active: true,
      status: "container",
    })
      .sort({ date: -1 })
      .limit(6);
    const kilos = await Announcement.find({
      userId: req.auth.userId,
      active: true,
      status: "kilos",
    })
      .sort({ date: -1 })
      .limit(6);

    for (let container of containers) {
      container.startCity2 = await City.findOne({ name: container.startCity });
      container.endCity2 = await City.findOne({ name: container.endCity });
    }

    for (let kilo of kilos) {
      kilo.startCity2 = await City.findOne({ name: kilo.startCity });
      kilo.endCity2 = await City.findOne({ name: kilo.endCity });
    }

    res
      .status(200)
      .json({
        status: 0,
        kilos,
        containers,
        startAt: containers.length == 6 ? 6 : null,
        startBt: kilos.length == 6 ? 6 : null,
      });
  } catch (err) {
    console.log(err);
    res.status(505).json({ err });
  }
};

exports.moreAnnouncements = async (req, res) => {
  //console.log(req.body);

  try {
    const annonces = await Announcement.find({
      userId: req.auth.userId,
      active: true,
      status: req.body.status,
    })
      .sort({ date: -1 })
      .skip(req.body.skip)
      .limit(6);

    if (req.body.status === "kilos") {
      for (let kilo of annonces) {
        kilo.startCity2 = await City.findOne({ name: kilo.startCity });
        kilo.endCity2 = await City.findOne({ name: kilo.endCity });
      }
    } else {
      for (let container of annonces) {
        container.startCity2 = await City.findOne({
          name: container.startCity,
        });
        container.endCity2 = await City.findOne({ name: container.endCity });
      }
    }

    res
      .status(200)
      .json({
        status: 0,
        annonces,
        skip: annonces.length === 6 ? parseInt(req.body.skip) + 6 : null,
        z: annonces.length,
      });
  } catch (e) {
    console.log(e);
    res.status(505).son({ e });
  }
};

exports.getAnnonces = async (req, res) => {
  
  
  try {
    const currentDate = new Date();
    const limit = req.body.three ? 3 : 60;
    console.log("Current Date:", currentDate );
    console.log("limit", limit)

    // Récupérer les annonces de conteneurs et de kilos
    const containers = await Announcement.find({
      active: true,
      status: "container",
      dateOfDeparture: { $gte: currentDate },
    })
      .sort({ date: -1 })
      .limit(limit);

    console.log("Containers found:", containers);

    const kilos = await Announcement.find({
      active: true,
      status: "kilos",
      dateOfDeparture: { $gte: currentDate },
    })
      .sort({ date: -1 })
      .limit(limit);

    // Récupérer toutes les villes nécessaires
    const cityNames = [
      ...new Set([
        ...containers.map((c) => c.startCity),
        ...containers.map((c) => c.endCity),
        ...kilos.map((k) => k.startCity),
        ...kilos.map((k) => k.endCity),
      ]),
    ];

    const cities = await City.find({ name: { $in: cityNames } });
    const cityMap = new Map(cities.map((city) => [city.name, city]));

    // Ajouter les informations de ville aux conteneurs et kilos
    containers.forEach((container) => {
      container.startCity2 = cityMap.get(container.startCity);
      container.endCity2 = cityMap.get(container.endCity);
    });

    kilos.forEach((kilo) => {
      kilo.startCity2 = cityMap.get(kilo.startCity);
      kilo.endCity2 = cityMap.get(kilo.endCity);
    });

    // Répondre avec les données traitées
    res.status(200).json({ status: 0, kilos, containers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnnonce = async (req, res) => {
  try {
    //console.log(req.body)

    const annonce = await Announcement.findOne({ _id: req.body.id });

    annonce.startCity2 = await City.findOne({ name: annonce.startCity });
    annonce.endCity2 = await City.findOne({ name: annonce.endCity });

    //console.log(annonce);

    const userObjectId = new ObjectId(annonce.userId);

    const user = await User.findOne({ _id: annonce.userId });

    const sum = await Announcement.countDocuments({
      userId: user._id,
      active: true,
    });

    res.status(200).json({ status: 0, annonce, sum, user });
  } catch (e) {
    console.log(e);
    res.status(505).json({ e });
  }
};

function monthNameToNumber(monthName) {
  const monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const monthIndex = monthNames.indexOf(monthName.toLowerCase());
  return monthIndex >= 0 ? monthIndex + 1 : null;
}

exports.annoncesRecherche = async (req, res) => {
  //console.log(req.body);

  // console.log(monthNameToNumber(req.body.month))

  let month = monthNameToNumber(req.body.month);
  let year = req.body.year;

  let startDate;

  console.log("le mois", new Date().getMonth());

  if (
    year === new Date().getFullYear() &&
    month - 1 === new Date().getMonth()
  ) {
    startDate = new Date();
  } else {
    startDate = new Date(year, month - 1, 1);
  }

  const endDate = new Date(year, month, 1);

  try {
    const annoncesCount = await Announcement.countDocuments({
      startCity: req.body.start,
      endCity: req.body.end,
      dateOfDeparture: {
        $gte: startDate,
        $lt: endDate,
      },
      status: req.body.type,
      active: true,
    });

    const annonces = await Announcement.find({
      startCity: req.body.start,
      endCity: req.body.end,
      dateOfDeparture: {
        $gte: startDate,
        $lt: endDate,
      },
      status: req.body.type,
      active: true,
    })
      .sort({ date: 1 })
      .skip(req.body.startAt)
      .limit(10);

    for (let kilo of annonces) {
      kilo.startCity2 = await City.findOne({ name: kilo.startCity });
      kilo.endCity2 = await City.findOne({ name: kilo.endCity });
    }

    res
      .status(200)
      .json({
        status: 0,
        annonces,
        count: annoncesCount,
        startAt:
          annonces.length === 10 ? parseInt(req.body.startAt) + 10 : null,
      });

    //console.log(annonces);
  } catch (e) {
    console.log(e);
    res.status(505).json({ e });
  }
};

//version admin

exports.getValidAnnouncements = async (req, res) => {
  try {
    // Récupérer la date actuelle
    const currentDate = new Date();

    // Trouver toutes les annonces avec une date de départ valide
    const validAnnouncements = await Announcement.find({
      dateOfDeparture: { $gt: currentDate }, // Filtrer les annonces avec une date de départ future
    });

    res.status(200).json({
      status: 0,
      announcements: validAnnouncements,
      message: "Annonces valides récupérées avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des annonces valides :",
      error
    );
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces valides",
      error,
    });
  }
};

exports.getFalseContainer = async (req, res) => {
  try {
    const currentDate = new Date(); // Date actuelle

    // Récupérer les annonces avec status "container", active à false, et date de départ valide
    const inactiveContainers = await Announcement.find({
      status: "container",
      active: false,
      dateOfDeparture: { $gt: currentDate }, // Vérifie que la date est future
    });

    res.status(200).json({
      status: 0,
      announcements: inactiveContainers,
      message:
        "Annonces inactives 'container' avec des dates valides récupérées avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des annonces inactives :",
      error
    );
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces inactives",
      error,
    });
  }
};

exports.getFalseKilo = async (req, res) => {
  try {
    const currentDate = new Date(); // Date actuelle

    // Récupérer les annonces avec status "kilos", active à false, et date de départ valide
    const inactiveKilo = await Announcement.find({
      status: "kilos",
      active: false,
      dateOfDeparture: { $gt: currentDate }, // Vérifie que la date est future
    });

    res.status(200).json({
      status: 0,
      announcements: inactiveKilo,
      message:
        "Annonces inactives 'kilos' avec des dates valides récupérées avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des annonces inactives :",
      error
    );
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la récupération des annonces inactives",
      error,
    });
  }
};

exports.getConversionRate = async (req, res) => {
  try {
    // Récupérer le nombre total d'utilisateurs
    const totalUsers = await User.countDocuments();

    // Récupérer le nombre d'utilisateurs ayant posté au moins une annonce
    const usersWithAnnouncements = await Announcement.distinct("userId");

    // Calculer le taux de conversion
    const conversionRate =
      totalUsers > 0
        ? ((usersWithAnnouncements.length / totalUsers) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      status: 0,
      conversionRate: `${conversionRate}`,
      totalUsers,
      usersWithAnnouncements: usersWithAnnouncements.length,
      message: "Taux de conversion calculé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du calcul du taux de conversion :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors du calcul du taux de conversion",
      error,
    });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.body;

    // Vérifier si l'ID est fourni
    if (!id) {
      return res.status(400).json({
        status: 1,
        message: "L'identifiant de l'annonce est requis.",
      });
    }

    // Utiliser `findByIdAndUpdate` pour réduire le nombre d'opérations
    const announcement = await Announcement.findById(id);

    // Vérifier si l'annonce existe
    if (!announcement) {
      return res.status(404).json({
        status: 1,
        message: "Annonce non trouvée.",
      });
    }

    const update = {};
    if (announcement.active) {
      // Si active est true, on le passe à false et on ajoute locked
      update.active = false;
      update.locked = true;
    } else {
      // Si active est false, on le passe à true et on retire locked
      update.active = true;
      update.$unset = { locked: "" }; // Utiliser $unset pour supprimer `locked`
    }

    // Appliquer les modifications
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      update,
      { new: true } // Retourner l'objet mis à jour
    );

    res.status(200).json({
      status: 0,
      message: "Statut 'active' mis à jour avec succès.",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut 'active' :", error);
    res.status(500).json({
      status: 1,
      message: "Erreur lors de la mise à jour du statut 'active'.",
      error,
    });
  }
};
