const express = require("express")
const app = express()
const router = require('./routes/index')
app.use('/api', router)
app.listen(3006, ()=>{
    console.log("Server listening on port 3006")
})