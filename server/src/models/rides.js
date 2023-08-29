const mongoose = require('mongoose');

const ridesSchema = new mongoose.Schema({
  dropAddr: {type: String},
  dropCords: {type: Object},
  pickUpAddr: {type: String},
  pickUpCords: {type: Object},
  bargainedPrice: Number,
  distance: Number,
  estimatedPrice: Number,
  passengerInfo:[{ type: Schema.Types.ObjectId, ref: 'Users' }],
  driverInfo:[{ type: Schema.Types.ObjectId, ref: 'Users' }],
  },{
    timestamps: true
  });
  
  const Rides = mongoose.model('Rides', ridesSchema);
  module.exports = Rides
