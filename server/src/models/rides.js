const mongoose = require('mongoose');

const ridesSchema = new mongoose.Schema({
  dropAddr: {type: String},
  dropCords: {type: Object},
  pickUpAddr: {type: String},
  pickUpCords: {type: Object},
  bargainedPrice: Number,
  distance: Number,
  estimatedPrice: Number,
  passenger: String,
  driver: String
  },{
    timestamps: true
  });
  
  const Rides = mongoose.model('Rides', ridesSchema);
  module.exports = Rides
