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

    ]
})


orderSchema.methods.calculateAmount=function(detailedOrder){
    let amount=0
    detailedOrder.items.forEach(item => {
        amount+=parseFloat(item.offering.price)*item.quantity
        let tax=0
        item.offering.taxes.forEach((taxcategory)=>{
            tax+=parseFloat(taxcategory.amount)
        })
        amount+=tax*item.quantity
    });

    return amount
    
}

const Order=mongoose.model('Order',orderSchema)
module.exports=Order