const express=require("express")
const Order=require("../models/order")
const router=new express.Router();

router.post('/order', async (req,res)=>{
    console.log(req.body)
    const order=new Order(req.body)

    try{
        await order.save()
        res.status(201).send({message:"Order booked",order})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/order', async (req,res)=>{
    try{
        const orders=await Order.find({})
        res.status(200).send(orders)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
    
})

module.exports=router