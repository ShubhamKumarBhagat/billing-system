const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','') //extract token from header
        const decoded=jwt.verify(token,'billing-system') //decode token
        const user=await User.findOne({_id:decoded._id,'tokens.token':token}) //check if user accoutn exisits
        if(!user)
        {
            throw new Error()
        }
        req.token=token 
        req.user=user //prevent further searching for user in db
        next()
    }
    catch(e)
    {
        res.status(401).send({message:'Authenticate before proceeding'})
    }
}

module.exports=auth