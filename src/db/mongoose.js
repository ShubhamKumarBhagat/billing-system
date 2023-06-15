const mongoose=require("mongoose")

const MONGO_URL='mongodb://127.0.0.1:27017/billing-system'

mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
}).then((res)=>{
    console.log(res)
})
.catch((err)=>{console.log(err)})
