const express = require("express");
require("dotenv").config();
const  {connection} = require("./config/db");
const  {userRouter} = require("./routers/user.routes");
const  {productRouter} = require("./routers/product.routes");
const app = express();
app.use(express.json());
app.use("/users",userRouter)
app.use("/products",productRouter)
app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})
const port=process.env.port || 4040
//console.log(port)
app.listen(port,async()=>{
    try {
        await connection()
        console.log("conected to db");
    } catch (error) {
        console.log(error);
    }
    console.log(`runig on port ${process.env.port}`);
})