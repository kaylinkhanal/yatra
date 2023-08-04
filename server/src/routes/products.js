const express=require('express')
const router=express.Router()
const ProductsController = require('../controller/products')
// router.get('/phone-available/:phoneNumber',UsersController.checkIfUserExists )
router.post('/products', ProductsController.addNewProducts )
router.get('/products', ProductsController.getAllProducts )

module.exports=router;