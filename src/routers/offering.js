const express=require("express")
const Offering=require("../models/offering")
const router=new express.Router();

router.post('/offering', async (req,res)=>{
    console.log(req.body)
    const offering=new Offering(req.body)

    try{
        await offering.save()
        res.status(201).send({offering})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/offering', async (req,res)=>{
    try{
        const offerings=await Offering.find({})
        res.status(200).send(offerings)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
    
})

module.exports=router