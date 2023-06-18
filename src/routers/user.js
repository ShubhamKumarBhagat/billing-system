const express=require("express")
const User=require("../models/user")
const router=new express.Router();
const auth=require("../middleware/auth");

// endpoint for account creation
router.post('/user', async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        res.status(201).send({message:"Sign up successfull"})
    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//endpoint for login
router.post('/user/login', async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({message:"Log in successfull",token})
    } catch (e) {
        
        res.status(400).send({message:e.message})
    }
})

//endpoint for logout
router.post('/user/logout', auth, async (req,res)=>{
    try{
        //removing token from array of tokens
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).send({message:"Log out successfull"})
    }
    catch(e)
    {
        res.status(400).send({message:e.message})
    }
})

//endpoint to view bill
router.get('/user/bill', auth, async(req,res)=>{
    try{
        //check if cart is empty
        if(req.user.cart.length==0){
            throw new Error('Cart is empty')
        }
        const detailedUser=await User.findOne({_id:req.user._id}).populate('cart.offering')
        const amount=req.user.calculateAmount(detailedUser.cart)// bill calculation
        
        res.status(200).send({bill:{amount,cart:detailedUser.cart}})
    }
    catch(e){
        res.status(400).send({message:e.message})
    }
})





module.exports=router