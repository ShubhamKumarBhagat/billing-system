const mongoose=require("mongoose")

// const MONGO_URL='mongodb://127.0.0.1:27017/billing-system'

const MONGO_URL='mongodb+srv://shubham:QAzs8M4LgkMk9Mn3@cluster0.iy9clp2.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
}).then((res)=>{
    
    
    console.log("Connection to DB established...")
    

})
.catch((err)=>{console.log(err)})
