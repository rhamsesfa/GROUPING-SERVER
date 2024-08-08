const Message = require("../models/Messages"); 
const User = require("../models/User");


exports.getMessages = async (req, res) => {
  
  //console.log(req.body);
  
  try{
    
    const messages = await  Message.find({user1Id: req.auth.userId, user2: req.body.user2}).sort({date: -1}).skip(req.body.startAt).limit(10)
    
    const user = await User.findOne({_id: req.body.user2});
    
    res.status(200).json({status: 0, messages, user, startAt: messages.length === 10 ? parseInt(req.body.startAt) + 10 : null})
    
    
    
  }catch(e){
    
      console.log(e); 
      res.status(505).json({e})
  }
  

}