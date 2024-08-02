 const express = require("express"); 

const router = express.Router(); 

const countryCtrl = require("../controllers/Country"); 

//router.post("addcountry", countryCtrl.addCounrty); 

router.post("/addcountry", countryCtrl.addC); 
router.get("/getcountries", countryCtrl.getCountries);

module.exports = router;