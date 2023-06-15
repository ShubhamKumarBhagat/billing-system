const express=require("express")
const app=express()
const port=3000
require("./db/mongoose")

app.use(express.json())

app.get("/",(req,res)=>{
    console.log(req.body)
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log("Server is running on port",port)
})