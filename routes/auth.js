require("dotenv").config();
const express = require("express");
const Mongoose = require("mongoose");
const router = express.Router();
const User = Mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
    user:process.env.MAIL,
    pass:process.env.MAIL_PASS
}
});

transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });

router.post("/signup",(req,res)=>{
  const {name,email,password,pic} = req.body;

  if(!email || !password || !name){
      res.status(422).json({error:"Please add all fields"});
      return
  }
  if(!validator.isEmail(email)){
    res.status(422).json({error:"Invalid Email"});
    return
  }
  User.findOne({email:email},function(err,user){

      if(!err){
        if(user){
             return res.status(422).json({error:"Already Exists"});
           }else{
               bcrypt.hash(password,10,function(err,hash){
                   if(err){
                       console.log(err);
                   }
                   else{
                    const user = new User({
                        name,
                        email,
                        password:hash,
                        pic
                    });
                    user.save()
                    .then(user=>{
                        transporter.sendMail({
                            to:user.email,
                            from:' insta@no-reply.com <shelly.dv08@gmail.com>',
                            subject:"Signup success",
                            html:"<h1>Welcome to insta clone</h1>"
                        }).then((res) => console.log("Successfully sent" + res))
                        .catch((err) => console.log("Failed ", err))
                     res.json({message:"Successfully Added",success:true});
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                   }
               }); 
           }
      }else{
          console.log(err);
      } 
    });
});

  router.post("/signin",(req,res)=>{
      const {email,password} = req.body;
      if(!email || !password){
        res.status(422).json({error:"Please add email or password"});
    }
      User.findOne({email:email})
      .then(foundUser=>{
          if(!foundUser){
            return res.status(422).json({error:"Wrong email or password"});
          }else{
              bcrypt.compare(password,foundUser.password)
              .then(doMatch=>{
                  if(doMatch){
                      const {_id,name,email,followers,following,pic} = foundUser;
                      const token =jwt.sign({_id:foundUser._id},process.env.JWT_KEY);
                      res.status(200).send({token,user:{_id,name,email,followers,following,pic},message:"Signed In",success:true});
                  }else{
                    return res.status(422).json({error:"Wrong email or password"});
                  }
              })
              .catch(err=>{
                  console.log(err);
              });
          }

      }).catch(err=>{
          console.log(err);
      });

  });

  router.post("/reset-password",(req,res)=>{
      crypto.randomBytes(32,(err,buffer)=>{
          if(err){
              console.log(err);
          }
          const token = buffer.toString("hex");
          User.findOne({email:req.body.email})
          .then(user=>{
              if(!user){
                  return res.status(422).json({error:"user don't exist"});
              }
              user.resetToken =  token;
              user.expireToken = Date.now() + 3600000;
              user.save().then(result=>{
                  transporter.sendMail({
                      to:user.email,
                      from:' insta@no-reply.com <divyanshuverma09@outlook.com>',
                      subject:"password mail",
                      html:`
                      <p>You requested for password reset</p>
                      <h5>click on this <a href="${process.env.URL}/${token}"">link</a> to reset password</h5>
                      `
                  })
                  res.json({message:"Check your mail"})
              })
          })
      })
  });

  router.post("/newpassword",(req,res)=>{
      const newPassword = req.body.password;
      const setToken =req.body.token;
      User.findOne({resetToken:setToken,expireToken:{$gt:Date.now()}})
      .then(user=>{
          if(!user){
            return res.status(422).json({error:"Try again session expired"});
          }
          bcrypt.hash(newPassword,10)
          .then(hash=>{
             user.password = hash;
             user.resetToken = undefined;
             user.expireToken = undefined;
             user.save()
             .then(savedUser=>{
                 res.json({message:"Password updated successfully"})
             })
          })
      }).catch(err=>{
          console.log(err);
      })
  });

module.exports = router;