const mongoose = require('mongoose');
const dbConfig = require('../config/dbConfig.json')

const connection = async() => {
    try{
      console.log(`${dbConfig.MONGODB_DATABASE_NAME}/${dbConfig.MONGODB_DATABASE_NAME}`)
      const res =  await  mongoose.connect(`${dbConfig.MONGODB_CONNECTION_URI}/${dbConfig.MONGODB_DATABASE_NAME}`);
      if(res) console.log("connected to mongodb")
    }catch(err){
        console.log(err)
    }
}

module.exports = connection
