const Users = require('../models/users')
const checkIfUserExists = async(req, res) => {
    const data= await Users.findOne({phoneNumber:req.params.phoneNumber })
    if(data) {
        res.json({
        msg: "Phone Number already exists",
        validPhoneNo: false
        })
    }else{
        res.json({
        validPhoneNo: true
        })
    }
    }

    const registerUser=  async(req, res) => {
        await Users.create(req.body)
        res.json({
        msg: "you are successfully registered",
        success: true
        })
    }

    module.exports = {checkIfUserExists,registerUser}