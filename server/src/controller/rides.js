const Rides = require('../models/rides')

const getAllPendingRides = async (req, res) => {
    try{
        const data = await Rides.find({rideStatus: "pending"}).populate('passenger')
        res.json({rideList: data})
    }catch(err){
        console.log(err)
    }
}






module.exports = { getAllPendingRides}
