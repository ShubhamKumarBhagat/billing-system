const express=require("express")
const User=require("../models/user")
const router=new express.Router();

router.post('/user', async (req,res)=>{
    const user=new User(req.body)

    try{
        await user.save()
        res.status(201).send({user})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/user', async (req,res)=>{
    try{
        const users=await User.find({})
        res.status(200).send(users)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
    
})

module.exports=router