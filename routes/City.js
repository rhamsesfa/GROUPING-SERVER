const express = require("express"); 

const router = express.Router(); 

const cityCtrl = require("../controllers/City"); 


router.post("/addcity", cityCtrl.addCity);


module.exports = router;