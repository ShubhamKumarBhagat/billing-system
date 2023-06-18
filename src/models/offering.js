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
    taxes:[
        {
            type:{
                type:String,
                required:true,
                trim:true
            },
            amount:{
                type:Number,
                required:true,
                minimum:0
            }
        }
    ]
})

offeringSchema.methods.calculateTaxes=function()
{
    const type=this.type
    const price=this.price
    let taxes=[]
    if(type.toLowerCase()==="product"){
        taxes.push({ 
           type:"PC",
           amount:200    //Flat tax on product
        })
        if(price>1000&&price<=5000){
            taxes.push({
                type:"PA",
                amount: .12*price //PA type tax
            })
        }
        else if(price>5000){
            taxes.push({
                type:"PB",
                amount: .18*price //PB type tax
            })
        }
    }
    else{
        taxes.push({ 
            type:"SC",
            amount:100   //Flat tax on service
        })
        if(price>1000&&price<=8000){
            taxes.push({
                type:"SA",
                amount: .10*price //SA type tax
            })
        }
        else if(price>8000){
            taxes.push({
                type:"SB",
                amount: .15*price //SB type tax
            })
        }
    }
    return taxes
}

const Offering=mongoose.model('Offering',offeringSchema)
module.exports=Offering