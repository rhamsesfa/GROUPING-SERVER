const express = require("express"); 

const router = express.Router(); 


const userCtrl = require("../controllers/User"); 


//router.get("/adduser", userCtrl.SignUp);

router.post("/adduser", userCtrl.Register); 
router.post("/register", userCtrl.signUpp);



module.exports = router;