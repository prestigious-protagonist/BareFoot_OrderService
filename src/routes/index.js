const express = require("express")
const v1Router = require('./routes/')
const router = express.Router()

router.post('/placeOrder', (req, res) => {
    //expect an array of varinatss id in req body
    try {
        const orders = req.body.orders;
        //check if orders exists in db
        for(let i = 0; i < orders.length; i++) {

        }
    } catch (error) {
        
    }
   
})
module.exports = router
