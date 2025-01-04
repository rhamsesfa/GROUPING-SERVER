 const express = require("express"); 

const router = express.Router(); 


const userCtrl = require("../controllers/User"); 
const auth = require("../middleware/auth"); 


//router.get("/adduser", userCtrl.SignUp);

router.post("/adduser", userCtrl.Register); 
router.post("/register", userCtrl.signUpp);
router.post("/signinwithgoogle", userCtrl.signInWithGoogle); 
router.post("/signinwithgoogleadmin", userCtrl.signInWithGoogleAdmin); 
router.post("/appleinfo", userCtrl.appleInfo);
router.post("/signin", userCtrl.signIn);
router.post("/signinAdmin", userCtrl.signInAdmin);
router.post("/getallusers", auth, userCtrl.getAllUsers)

module.exports = router;