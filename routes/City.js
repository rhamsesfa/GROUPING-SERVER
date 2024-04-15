const express = require("express"); 

const router = express.Router(); 

const cityCtrl = require("../controllers/City"); 


router.post("/addcity", cityCtrl.addCity);
router.get("/getcities", cityCtrl.getCities);


module.exports = router;