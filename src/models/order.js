const mongoose = require('mongoose')

const orderSchema=new mongoose.Schema({
    items:[
        {
            item:{
                offeringid:{
                    type:mongoose.Types.ObjectId,
                    required:true,
                    ref:'Offering'
                },
                quantity:{
                    type:Number,
                    required:true,
                    default:1
                }
            }
        }

    ],
    amount:{
        type:Number,
        required:true
    }
})

const Order=mongoose.model('Order',orderSchema)
module.exports=Order