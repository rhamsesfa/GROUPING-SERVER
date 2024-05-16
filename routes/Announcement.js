const express = require("express"); 

const router = express.Router(); 

const announcementCtrl = require("../controllers/Announcement"); 

const auth = require("../middleware/auth"); 


router.post("/addannouncement", auth, announcementCtrl.addAnnouncement); 

module.exports = router; 



