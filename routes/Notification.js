const express = require("express"); 

const router = express.Router(); 

const notificationCtrl = require("../controllers/Notification"); 

const auth = require("../middleware/auth"); 


router.get("/viewnotifs", auth, notificationCtrl.viewNotifications ); 
router.get("/notread", auth, notificationCtrl.getNotReadNotifications);

module.exports = router;