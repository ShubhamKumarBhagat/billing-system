const express=require("express")
const Order=require("../models/order")
const router=new express.Router();
const auth=require("../middleware/auth")



//endpoint for placing order
router.post('/order',auth, async (req,res)=>{
    try{
        //check if cart is empty
        if(req.user.cart.length==0){
            throw new Error('Cart is empty. Add items to place an order')
        }
        
        const order=new Order()
        order.items=req.user.cart
        await order.save()

        const detailedOrder=await Order.findOne({_id:order._id}).populate('items.offering')
        const amount=order.calculateAmount(detailedOrder)// amount calculation

        req.user.cart=[]    
        req.user.orders.push({order:order._id})
        await req.user.save()

        res.status(201).send({message:"Order Placed",amount,order:detailedOrder})
    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})



module.exports=router