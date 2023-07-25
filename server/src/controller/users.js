const Users = require('../models/users')
const bcrypt = require('bcrypt');
const saltRounds = 10

    const registerUser=  async(req, res) => {
        try{
            //check if user already exists
            const data= await Users.findOne({phoneNumber:req.body.phoneNumber })
            if(data){
                res.status(409).json({
                    msg: "Phone Number already exists",
                    success: false
                })
            }else{
                    //create a hash password of req.body.password
                    req.body.password = await bcrypt.hash(req.body.password, saltRounds)
                    await Users.create(req.body)
                    res.json({
                        msg: "you are successfully registered",
                        success: true
                    })
            }
          
        }catch(err){
            console.log(err)
        }
      
    }

    module.exports = {registerUser}