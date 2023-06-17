const express=require("express")
const User=require("../models/user")
const router=new express.Router();
const auth=require("../middleware/auth")
const mongoose=require("mongoose")

//Endpoint for adding a new item or incrementing quantity of present item by any amount
router.post('/addtocart', auth, async (req,res)=>{
    try{
        console.log(req.user)
        const offeringid=new mongoose.Types.ObjectId(req.body.offeringid);
        const cart=req.user.cart;
        const quantity=parseInt(req.body.quantity)
        //check if item already present in cart
        const foundindex=cart.findIndex((item)=>{ 
            return item.offeringid.equals(offeringid)
        })

        if(foundindex>=0){
            cart[foundindex].quantity+=quantity
        }
        else{
            cart.push({offeringid,quantity})
        }
        

        await req.user.save()
        // res.status(200).send({item:cart[foundindex]})
        res.status(200).send({cart})

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//Endpoint for decreasing quantity one by one
router.patch('/decreasefromcart',auth, async(req,res)=>{
    try{
        const offeringid=new mongoose.Types.ObjectId(req.body.offeringid);
        const cart=req.user.cart;

        //check if item present or not
        const foundindex=cart.findIndex((item)=>{ 
            return item.offeringid.equals(offeringid)
        })

        if(foundindex<0)
        throw new Error();

        cart[foundindex].quantity--;

        await req.user.save()
        res.status(200).send({cart})

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//Endpoint for deleting an item from cart
router.delete('/deletefromcart',auth, async(req,res)=>{
    try{
        const offeringid=new mongoose.Types.ObjectId(req.body.offeringid);
        const cart=req.user.cart;

        //check if item present or not
        const foundindex=cart.findIndex((item)=>{ 
            return item.offeringid.equals(offeringid)
        })

        if(foundindex<0)
        throw new Error();

        cart.splice(foundindex,1);

        await req.user.save()
        res.status(200).send({cart})

    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//Endpoint to empty the cart
router.delete('/emptycart',auth, async(req,res)=>{
    try{
        const cart=req.user.cart;
        cart=[]

        await req.user.save()
        res.status(200).send({cart})

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