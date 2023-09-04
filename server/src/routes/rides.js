const express = require('express')
const router = express.Router()
const RidesController = require('../controller/rides')


router.get('/rides', RidesController.getAllPendingRides)

module.exports = router;