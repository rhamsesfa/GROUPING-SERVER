const express = require("express"); 

const router = express.Router(); 

const announcementCtrl = require("../controllers/Announcement"); 

const auth = require("../middleware/auth"); 
const multer = require("../middleware/multer-configs"); 
const multer2 = require("../middleware/multer-configs2"); 

router.post("/addannouncement", auth, multer, multer2, announcementCtrl.addAnnouncement); 
router.post("/addannouncementwithpdf", auth, multer,  )

module.exports = router; 



