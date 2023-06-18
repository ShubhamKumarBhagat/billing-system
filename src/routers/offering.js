const express=require("express")
const Offering=require("../models/offering")
const router=new express.Router();



//endpoint to fetch list of all products and services
router.get('/offering', async (req,res)=>{
    try{
        const offerings=await Offering.find({})
        res.status(200).send({count:offerings.length,offerings})
    }
    catch(e)
    {
        res.status(500).send({message:e.message})
    }
    
})

module.exports=router