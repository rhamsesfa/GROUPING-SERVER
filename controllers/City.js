const City = require("../models/City"); 

exports.addCity = (req, res) => {
  
    console.log(req.body);
  
    City.findOne({$or: [{code: req.body.code}, {name: req.body.name}]}).then((ville) => {
      
      if(ville){
        
        res.status(200).json({status: 1, ville});
          
      }else{
        
          const city = new City({
          name: req.body.name, 
          country: req.body.country, 
          code: req.body.code, 
          country_id: req.body.country
            
          })

        city.save().then(() => {

            res.status(201).json({status: 0});

        }, (err) => {

            res.status(505).json({err})
        })
      }
      
    }, (err) => {
      
        console.log(err); 
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

exports.getCitiesByCountryId = (req, res) => {
  
    //console.log(req.body)
  
    City.find({country_id: req.body._id}).then((cities) => {
      
      //console.log(cities);
      
       res.status(200).json({status: 0, cities});
        
    }, (err) => {
      
      console.log(err)
      
        res.status(505).json({err})
    })
}