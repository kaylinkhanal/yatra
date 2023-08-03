const Users = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10

    const registerUser=  async(req, res) => {
        try{
            // step 1: check if user/phoneNumber already exists
            const data= await Users.findOne({phoneNumber:req.body.phoneNumber })
            if(data){
                res.status(409).json({
                    msg: "Phone Number already exists",
                    success: false
                })
            }else{
                    //step 2: create a hash password of req.body.password
                    req.body.password = await bcrypt.hash(req.body.password, saltRounds)
                    //step 3: create a jwt token for the user
                    const token = jwt.sign({ phoneNumber:req.body.phoneNumber}, process.env.SECRET_KEY);
                    const data = await Users.create(req.body)
                    if(data){
                        const {password, ...otherFields} = data._doc
                        res.json({
                            msg: "you are successfully registered",
                            success: true,
                            token,
                            userDetails: otherFields
                        })
                    }
                   
            }
          
        }catch(err){
            console.log(err)
        }
      
    }


    const loginUser=  async(req, res) => {
        try{
          const data = await Users.findOne({phoneNumber: req.body.phoneNumber}) 
          if(data){
            const isMatched = await bcrypt.compare(req.body.password, data.password)
            if(isMatched){
                const token = jwt.sign({ phoneNumber:req.body.phoneNumber}, process.env.SECRET_KEY);
                res.json({
                    token:token,
                    success: true,
                    userDetails: data
                })
            }else{
                res.json({
                    success: false,
                    msg: "Password didn't matched"
                })
            }
          }else{
            res.json({
                success: false,
                msg: "Phone Number doesn't exist"
            })
          }
        }catch(err){
            console.log(err)
        }
      
    }

    const changePassword = async(req ,res) =>{
        try{
            const userId =req.params.id;
            const data = await Users.findById(userId)      
            if(data){   
                const isMatched = await bcrypt.compare(req.body.currentPassword,data.password)
                if(!isMatched){
                    res.status(401).json({
                        msg: "Incorrect password",
                        passChange: false,
                    })
                }
                else{
                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, saltRounds)
                    await Users.findByIdAndUpdate(userId,{password: req.body.newPassword})
                    res.status(200).json({
                        msg: "Password Changed Success",
                        passChange: true,
                    })
                }
            }
        }catch(err){
            console.log(err);
        }
     }

    module.exports = {registerUser,loginUser,changePassword}