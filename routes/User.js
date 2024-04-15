const express = require("express"); 

const router = express.Router(); 

const userCtrl = require("../controllers/User"); 


router.post("/adduser", userCtrl.SignUp);



module.exports = router;