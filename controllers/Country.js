const Country = require("../models/Country");

exports.addCountry = (req, res) => {
  const country = new Country({
    name: req.body.name,
  });

  country.save().then(
    () => {
      res.status(201).json({ status: 0, message: "Ajouté avec succès" });
    },
    (err) => {
      console.log(err);
      res.status(500).json({ err });
    }
  );
};

exports.addC = (req, res) => {
  
  const country = new Country({
    name: req.body.name,
  });

  country.save().then(
    () => {
      res.status(201).json({ status: 0, message: "Ajouté avec succès" });
    },
    (err) => {
      console.log(err);
      res.status(500).json({ err });
    }
  );
}

exports.getCountries = (req, res) => {
  
  //console.log(req.body);
  
    Country.find().then((countries) => {

      //console.log(countries);
      
      res.status(200).json({countries, status: 0})
        
    }, (err) => {
      
        res.status(500).json({err})
    })
}
