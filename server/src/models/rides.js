const mongoose = require('mongoose');

const ridesSchema = new mongoose.Schema({
  dropAddr: {type: String},
  dropCords: {type: Object},
  pickUpAddr: {type: String},
  pickUpCords: {type: Object},
  bargainedPrice: Number,
  rideStatus: {
    type: String,
    enum : ['pending','riderAccepted','cancelled'],
    default: 'pending'
  },
  distance: Number,
  vehicleType: {
    type: String,
    enum : ['Bike','Car','Boat'],
    default: 'Bike'
  },
  estimatedPrice: Number,
  passenger:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  driver:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  },{
    timestamps: true
  });
  
  const Rides = mongoose.model('Rides', ridesSchema);
  module.exports = Rides
