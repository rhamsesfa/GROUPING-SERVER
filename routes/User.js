const express = require("express"); 

const router = express.Router(); 


const userCtrl = require("../controllers/User"); 


//router.get("/adduser", userCtrl.SignUp);

router.post("/adduser", userCtrl.Register); 



module.exports = router;