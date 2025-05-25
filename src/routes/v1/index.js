const express = require("express");
const {order} = require("../../models/index");
const { Op } = require("sequelize");
const router = express.Router()
router.post('/placeOrder',(req, res, next) => {
    try {
        const data = req.body;
        if (!(data.items && data.price)) {
            throw new Error("Insufficient fields");
        }
        req.validatedData = data;
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
,async (req, res)=>{
    let userId =  req.headers["x-user-id"]
    try {
        if(!userId) {
            res.status(400).json({
            msg: "Login first",
           }) 
        }
        const data = {...req.body, userId, deliveryStatus: false}
        const response = await order.create(data)
        return res.status(201).json({
            msg: "Order placed successfully",
            data: response
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "something went wrong",
        })   
    }
})

router.get('/myOrders', async(req, res)=>{
    let userId =  req.headers["x-user-id"]
    try {
        const response = await order.findAll({
            where:{
                userId,
            }
        })
        if(!response) {
            res.status(401).json({
                msg: "No orders to show."
            })
        }
        res.status(200).json({
            msg: "fetched orders",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            msg: "something went wrong",
        }) 
    }
})

router.delete('/deleteOrder', async(req, res)=>{
    let userId =  req.headers["x-user-id"]
    const orderId = req.body.orderId
    try {
        if (!(userId && orderId)) {
            throw new Error("Insufficient fields");
        }
        const response = await order.findAll({
            where:{
                [Op.and]:[
                    {userId,},{id: orderId}
                ]
                 
            }
        })


        if(!response)  throw new Error("Order doesnt exists.");
        const response1 = await order.destroy({
            where:{
                [Op.and]:[
                    {userId,},{id: orderId}
                ]
                 
            }
        })

        res.status(200).json({
            msg: "Order deleted",
            data: response
        })
    } catch (error) {
        console.log(error)
         res.status(500).json({
            msg: "something went wrong",
        }) 
    }
})
module.exports = router 