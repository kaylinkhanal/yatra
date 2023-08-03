const express=require('express')
const router=express.Router()
const UsersController = require('../controller/users')
// router.get('/phone-available/:phoneNumber',UsersController.checkIfUserExists )
router.post('/register', UsersController.registerUser )
router.post('/change-password/:id', UsersController.changePassword )

router.post('/login', UsersController.loginUser )
router.put('/user/:uid', UsersController.updateUser )


module.exports=router;