const mongoose = require('mongoose')
const validator=require("validator")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")

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
            offering:{
                type:mongoose.Types.ObjectId,
                required:true,
                ref:'Offering'
            },
            quantity:{
                type:Number,
                required:true,
                validate(value){
                    if(!Number.isInteger(value))
                    throw new Error("Quantity of an item cannot be fractional")
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
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


//methods defined on individual instances
userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'billing-system')
    
    user.tokens=user.tokens.concat({token})
    await user.save()

    return token

}

userSchema.methods.calculateAmount= function(cart){
    let bill=0
    //for each item of cart sum prices and taxes and multiply with quantity
    cart.forEach(item => {
        bill+=parseFloat(item.offering.price)*parseInt(item.quantity)
        let tax=0
        item.offering.taxes.forEach((taxcategory)=>{
            tax+=parseFloat(taxcategory.amount)
        })
        bill+=tax*parseInt(item.quantity)
    })
    return bill
}

//statics defined on model
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user)
    {
        throw new Error("Login failed due to wrong credentials")
    }
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error("Login failed due to wrong credentials")
    }
    return user
}

//Hash Password before saving
userSchema.pre('save', async function(next){ //no arrow function due to absence of this  binding
    const user=this
    if(user.isModified('password'))// hashing only needed when password is set or reset i.e modified
    {
        user.password=await bcryptjs.hash(user.password,10)
    }
    next()
}) 

const User=mongoose.model('User',userSchema)
module.exports=User