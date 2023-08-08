const express = require('express')
const router = express.Router()
const UsersController = require('../controller/users')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/userAvatar')
    },
    filename: function (req, file, cb) {
      cb(null, Math.floor(Math.random() *10000000)+ file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
// router.get('/phone-available/:phoneNumber',UsersController.checkIfUserExists )
router.post('/register', UsersController.registerUser)
router.put('/verify-details/:id', upload.single('avatar'), UsersController.verifyUserDetails)

router.post('/register', UsersController.registerUser)
router.post('/change-password/:id', UsersController.changePassword)
router.post('/login', UsersController.loginUser)
router.put('/users/:id', UsersController.changeUserDetails)


module.exports = router;