const User = require("../models/User"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signUp = (req, res) => {
  
  
  
  User.findOne({phone: req.body.email}).then((user) => {
    
    if(user){
      
      res.status(201).json({status: 1, message: "Adresse déjà utilisée"}); 
      
    }else{
      
      bcrypt.hash(req.body.password, 10).then(async (hash) => {
        
        const newUser = User({
          email: req.body.email, 
          name: req.body.name, 
          password: hash, 
          date: new Date()
        })
        
      
        
           const us =   await  newUser.save().then((uss) => { return uss._id})
          
         

            
  
                res.status(201).json({status: 0, message: "Utilisateur ajouté avec succès", token: jwt.sign(
                {userId: us._id}, 
                 "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
                
            )}); 
     
               
               
 
          
      }, (err) => {
        
         res.status(505).json({err});
          
      })
        
    }
      
  }, (err) => {
    
      res.status(505).json({err})
  })
  
}