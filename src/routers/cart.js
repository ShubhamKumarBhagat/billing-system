const express=require("express")
const router=new express.Router();
const auth=require("../middleware/auth")
const mongoose=require("mongoose")
const User=require("../models/user")
const Offering=require("../models/offering")

//Endpoint for adding a new item or incrementing quantity of present item by any amount
router.post('/cart', auth, async (req,res)=>{
    try{
        const offering=new mongoose.Types.ObjectId(req.body.offering);
        const cart=req.user.cart;
        const quantity=parseInt(req.body.quantity)

        const item=await Offering.findById(offering)
        if(!item){
            throw new Error("Offering does not exist")
        }
        
        //check if item already present in cart
        const foundindex=cart.findIndex((item)=>{ 
            return item.offering.equals(offering)
        })

        if(foundindex>=0){
            cart[foundindex].quantity+=quantity
        }
        else{
            cart.push({offering,quantity})
        }
        

        await req.user.save()
        // res.status(200).send({item:cart[foundindex]})
        res.status(200).send({message:"Offering added to cart"})

    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//Endpoint for decreasing quantity one by one
router.patch('/cart',auth, async(req,res)=>{
    try{
        const offering=new mongoose.Types.ObjectId(req.body.offering);
        let cart=req.user.cart;

        //check if item present or not
        const foundindex=cart.findIndex((item)=>{ 
            return item.offering.equals(offering)
        })
        
        if(foundindex<0)
        throw new Error('Item does not exist in cart');
        
        cart[foundindex].quantity--;

        if(cart[foundindex].quantity==0){// remove from cart if q=0
            cart=cart.splice(foundindex,1)
        }

        await req.user.save()
        res.status(200).send({message:"Item decreased by one"})

    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//Endpoint for deleting an item from cart
router.delete('/cart/:id',auth, async(req,res)=>{
    try{
        const offering=new mongoose.Types.ObjectId(req.params.id);
        const cart=req.user.cart;

        //check if item present or not
        const foundindex=cart.findIndex((item)=>{ 
            return item.offering.equals(offering)
        })

        if(foundindex<0)
        throw new Error("Item does not exist in cart");

        cart.splice(foundindex,1);

        await req.user.save()
        res.status(200).send({message:"Item deleted from cart"})

    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//Endpoint to empty the cart
router.delete('/cart',auth, async(req,res)=>{
    try{

        req.user.cart=[]

        await req.user.save()
        res.status(200).send({message:"Cart is emptied"})

    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//Endpoint to view cart
router.get('/cart', auth, async (req,res)=>{
    try{
        res.status(200).send({cart:req.user.cart})
    }
    catch(e)
    {
        res.status(500).send({message:e.message})
    }
    
})

module.exports=router