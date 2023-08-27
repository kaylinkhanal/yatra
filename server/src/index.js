const express = require('express')
require('dotenv').config()
const connection = require('./db/connection')

const cors = require('cors')
const userRoute=require('./routes/users')

connection()
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*"
  }
});
app.use(cors())
const port = process.env.PORT || 4000
app.use(express.json())

app.use("/",userRoute)

app.post('/connection', (req,res) => {
  console.log('a user connected');
});

// io.on('connection', (socket) => {
//   io.on('users', (userId) => {
//     io.emit('fdsa' ,"hi")
//   });
// });

 server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })