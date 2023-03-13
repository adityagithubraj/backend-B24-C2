const mongoose=require("mongoose")

const productSchema =mongoose.Schema({
title:String,
price:Number,
author:String,
user:String 

})

const productModel=mongoose.model("product",productSchema)
module.exports={productModel}