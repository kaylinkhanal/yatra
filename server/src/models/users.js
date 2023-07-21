const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {type:String, required: true}, // String is shorthand for {type: String}
    phoneNumber: String,
    email: String,
    password: String,
    mode: {type: String, default: 'User'},
    vehicleDetails: Object
  });
  
  const Users = mongoose.model('Users', userSchema);
  module.exports = Users