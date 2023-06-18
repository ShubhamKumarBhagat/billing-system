const express=require("express")
const router=new express.Router();
const Offering=require("../models/offering")
const Order=require("../models/order")
const User=require("../models/user")

//endpoint for admin to add product and services
router.post('/admin/offering', async (req,res)=>{
    try{
        const offering=new Offering(req.body)
        offering.taxes=offering.calculateTaxes()
        await offering.save()
        res.status(201).send({message:"Offering added",offering})
    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

// endpoint for admin to see all users
router.get('/admin/user', async (req,res)=>{
    try{
        const users=await User.find({},{_id:0,name:1,email:1,cart:1,orders:1})
        res.status(200).send({count:users.length,users})
    }
    catch(e)
    {
        res.status(500).send({message:e.message})
    }
    
})

//endpoint for admin to view all orders
router.get('/admin/orders', async (req,res)=>{
    try{
        const orders=await Order.find({})
        res.status(200).send({orders})
    }
    catch(e)
    {
        res.status(500).send({message:e.message})
    }
    
})

module.exports=router