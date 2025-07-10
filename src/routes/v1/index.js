const express = require("express");
const {order} = require("../../models/index");
const { Op } = require("sequelize");
const router = express.Router()
const axios = require("axios");
const sendBasicEmail = require("../../utils/email-service");
const { BASE_URL } = require("../../config/server-config");
router.post('/placeOrder',(req, res, next) => {
    try {
        const data = req.body;
        console.log("Line 11 "+data)
        if (!(data.items && data.price)) {
            throw new Error("Insufficient fields");
        }
        console.log("ITEMS:: "+data.items)
        req.validatedData = data;
        
        console.log("LIne 18 "+req.validatedData)
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
},
async (req, res, next) => {
  try {
    console.log(req.headers.authorization.substring(7))
    const { variantId, quantity, size } = req.body.items[0];

   const response = await axios.patch(
  `${BASE_URL}/productService/api/user/decreaseSize`,
  {
    variantsId: variantId,
    orderCount: quantity,
    size,
  },
  {
    headers: {
      Authorization: `Bearer ${req.headers.authorization.substring(7)}`
    }
  }
);


  
    next()
  } catch (error) {
    console.log("Error coming:", error.response.data);
    res.status(400).json({ error:  error.response.data});
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
        console.log("data is : " + JSON.stringify(data, null, 2))

        const response = await order.create(data)
        console.log("RESPONSE IS : "+JSON.stringify(response, null, 2))
        await sendBasicEmail(
            "jaskaranyt123@gmail.com",         // sender
            data.address.email,                             // recipient (user's email)
            "Your Order is Confirmed – BareFoot Shoes 👟",
            `
            Hey,

            Thank you for shopping with **BareFoot**! 🎉  
            We’ve successfully received your order.

            🧾 **Order ID**: ${response?.id}
            

            📦 **Shipping Address**:
           
            ${data.address.flatNumber},  
            ${data.address.locality}, ${data.address.city} - ${data.address.state}  
            Phone: ${data.address.phone}

            We’ll notify you once your order is packed and shipped.

            Thanks again for choosing BareFoot – where comfort meets style!

            Warm regards,  
            **The BareFoot Team**
            `
            );

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

router.post('/applyCoupon/:couponCode', (req, res) => {
    if(req.params.couponCode == "DIWALI2025"){
        res.status(200).json({value:25})
    }else{
        res.status(500).json({
            msg: "Invalid Coupon code"
        })
    }
})

router.get('/promoMessage', (req, res) => {

    res.status(200).json({message:"Apply Code: DIWALI2025 to get 25% Discount 🎉🎉"})

})
module.exports = router 