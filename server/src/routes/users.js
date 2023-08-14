const express = require('express')
const router = express.Router()
const UsersController = require('../controller/users')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/userAvatar')
    },
    filename: function (req, file, cb) {
      console.log(file)
      cb(null, Math.floor(Math.random() *10000000)+ file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
// router.get('/phone-available/:phoneNumber',UsersController.checkIfUserExists )
router.post('/register', UsersController.registerUser)
router.put('/verify-details/:id', upload.single('licenseImage'), UsersController.verifyUserDetails)

router.get('/liscense-img/:id', UsersController.getLicenseImgById)

router.post('/register', UsersController.registerUser)
router.post('/change-password/:id', UsersController.changePassword)
router.post('/login', UsersController.loginUser)
router.get('/users', UsersController.getAllUsers)
router.put('/users/:id', UsersController.changeUserDetails)
router.delete('/delete-user/:id', UsersController.deleteUser)




module.exports = router;