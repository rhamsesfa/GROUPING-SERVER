const express = require("express"); 

const router = express.Router(); 


const userCtrl = require("../controllers/User"); 


//router.get("/adduser", userCtrl.SignUp);

router.post("/adduser", userCtrl.Register); 
router.post("/register", userCtrl.signUpp);
router.post("/signinwithgoogle", userCtrl.signInWithGoogle); 
router.post("/appleinfo", userCtrl.appleInfo);


module.exports = router;