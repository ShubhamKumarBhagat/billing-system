const mongoose = require('mongoose')

const offeringSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type:Number,
        required:true,
        validate(value){
            if(value<=0){
                throw new Error('Price should be non-negative')
            }
        }
    },
    type:{
        type: String,
        required:true,
        trim:true,
        validate(value)
        {
            if(!(value.toLowerCase()==="product"||value.toLowerCase()==="service")){
                throw new Error('Offering can be only product or service')
            }
        }
    },
})

const Offering=mongoose.model('Offering',offeringSchema)
module.exports=Offering