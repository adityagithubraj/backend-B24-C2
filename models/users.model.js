const mongoose=require("mongoose")

const userSchema =mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,
    enum:["user","seller"],default:"user"}
})

const userModel=mongoose.model("user",userSchema)
module.exports={ userModel}