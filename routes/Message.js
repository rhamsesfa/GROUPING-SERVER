const express = require("express"); 

const router = express.Router(); 

const messageCtrl = require("../controllers/Message"); 
const auth = require("../middleware/auth"); 

router.post("/getmessages", auth, messageCtrl.getMessages)

module.exports = router;