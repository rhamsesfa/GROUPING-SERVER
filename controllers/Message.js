const Message = require("../models/Messages"); 



exports.getMessages = async (req, res) => {
  
  //console.log(req.body);
  
  try{
    
    const messages = await  Message.find({user1Id: req.auth.userId, user2: req.body.user2}).sort({date: -1}).startAt(req.body.startAt).limit(10)
      
    
  }catch(e){
    
      console.log(e); 
      res.status(505).json({e})
  }
  

}