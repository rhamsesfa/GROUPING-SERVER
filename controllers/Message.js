const Message = require("../models/Messages"); 
const User = require("../models/User");
const Announcement = require("../models/Announcement"); 

exports.getMessages = async (req, res) => {
  
  //console.log(req.body);
  
  try{
    
    const messages = await  Message.find({user1Id: req.auth.userId, user2: req.body.user2}).sort({date: -1}).skip(req.body.startAt).limit(10)
    
    const user = await User.findOne({_id: req.body.user2});
    
    const count = await Announcement.countDocuments({userId: req.body.user2, active: true})
    
    res.status(200).json({status: 0, messages, user, startAt: messages.length === 10 ? parseInt(req.body.startAt) + 10 : null, count})
    
    
    
  }catch(e){
    
      console.log(e); 
      res.status(505).json({e})
  }
  

}


exports.addMessage = (req, res) => {
    
  const newMessage = new Message({
    
      date: new Date(), 
      text: req.body.text, 
      user1Id: req.auth.userId, 
      user2Id: req.body._id
      
  }); 
  
    try{
      
        
    }catch(e){
      
        
    }
    
}