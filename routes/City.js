const express = require("express"); 

const router = express.Router(); 

const cityCtrl = require("../controllers/City"); 


router.post("/addcity", cityCtrl.addCity);
router.get("/getcities", cityCtrl.getCities);
router.post("/getcitiesbycountryid", cityCtrl.getCitiesByCountryId)

module.exports = router;