const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {type:String, required: true}, // String is shorthand for {type: String}
    phoneNumber: {type:String, required: true},
    email: String,
    password: String,
    mode: {type: String, default: 'Passenger'},
    verified: {type: Boolean, default:false},
    productName: {type: String},
    licenseNumber: String,
    userId: String,
    licenseImage: String,
  });
  
  const Users = mongoose.model('Users', userSchema);
  module.exports = Users
