const City = require("../models/City"); 

exports.addCity = (req, res) => {
  
    const city = new City({
      name: req.body.name, 
      country: req.body.country, 
      code: req.body.code
      })
    
    city.save().then(() => {
      
        res.status(201).json({status: 0})
    
    }, (err) => {
      
        res.status(505).json({err})
    })
}


exports.getCities = (req, res) => {
  
    City.find().then((cities) => {
      
      res.status(200).json({status: 0, cities});
      
        
    }, (err) => {
      
        res.status(505).json({err})
    })
}