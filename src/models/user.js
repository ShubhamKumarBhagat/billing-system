const mongoose = require('mongoose')
const validator=require("validator")
const bcryptjs=require("bcryptjs");

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    cart:[
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
                    minimum:1,
                    default:1,
                    validate(value){
                        if(!Number.isInteger(value))
                        throw new Error("Quantity of an item cannot be fractional")
                    }
                }
            }
        }
    ],
    orders:[
        {
            order:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'Order'
            }
        }
    ]
})

//Hash Password before saving
userSchema.pre('save', async function(next){ //no arrow function due to absence of this  binding
    const user=this
    const hashedPassword=await bcryptjs.hash(user.password,10)
    user.password=hashedPassword
    next()
}) 

const User=mongoose.model('User',userSchema)
module.exports=User