const mongoose = require('mongoose')

const orderSchema=new mongoose.Schema({
    items:[
        {
            offering:{
                type:mongoose.Types.ObjectId,
                required:true,
                ref:'Offering'
            },
            quantity:{
                type:Number,
                required:true,
            }
        }

    ],
    amount:{
        type:Number,
        required:true,
    }
})

const Order=mongoose.model('Order',orderSchema)
module.exports=Order