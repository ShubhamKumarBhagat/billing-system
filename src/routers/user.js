const express=require("express")
const User=require("../models/user")
const router=new express.Router();
const auth=require("../middleware/auth");

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

router.post('/user/login', async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({message:"LoggedIn",user,token})
    } catch (e) {
        //console.log(e)
        res.status(400).send(e)////error not returned(recheck)
    }
})

router.post('/user/logout', auth, async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).send({message:"LoggedOut"})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})



// Endpoints for admin

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