const express = require("express"); 

const router = express.Router(); 

const countryCtrl = require("../controllers/Country"); 

router.post("addcountry", countryCtrl.addCounrty); 

module.exports = router;