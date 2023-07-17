const express = require('express')
require('dotenv').config()
const connection = require('./db/connection')
const Users = require('./models/users')
connection()
const app = express()
const port = process.env.PORT
app.use(express.json())


app.post('/register', async(req, res) => {
  await Users.create(req.body)
  res.json({
    msg: "you are successfully registered"
  })
})




 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })