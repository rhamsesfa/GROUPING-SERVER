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
