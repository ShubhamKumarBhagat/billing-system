const express=require("express")
const app=express()
const port=3000
require("./db/mongoose")


const offeringRouter=require("./routers/offering")



app.use(express.json())
app.use(offeringRouter)

app.get("/",(req,res)=>{
    console.log(req.body)
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log("Server is running on port",port)
})