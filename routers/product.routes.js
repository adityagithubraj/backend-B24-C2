const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const  {productModel} = require("../models/products.model");
const  {authenticate} = require("../middlewares/authenticate.middleware");
const  {authorise} = require("../middlewares/authorise.middleware");

const productRouter = express.Router();

//  productRouter.get("/products",authenticate,async(req,res)=>{
//     res.status(200).send("")
//})
//
//////////// get product
productRouter.get("/",authenticate,async(req,res)=>{
let query=req.query
try{
const product=await productModel.find(query)
res.send(product)
}
catch(err){
res.send({"msg":"Cannot get the users","error":err.message})
}
})

/////////creat product
productRouter.post("/create",authenticate,authorise(["seller"]),async(req,res)=>{
const payload=req.body
try{
const product=new productModel(payload)
await product.save()
res.send("product Created")
}
catch(err){
res.send({"msg":"not product created ","error":err.message})
}
})
//////////////delet product //////////////

productRouter.delete("/delete/:id",authenticate,authorise(["seller"]),async(req,res)=>{
const productID=req.params.id
await productModel.findByIdAndDelete({_id:productID})
res.send({"msg":`product with id:${productID} has been Deleted`})
})

/////////////updata////

productRouter.patch("/update/:id",authenticate,authorise(["seller"]),async(req,res)=>{
const productID=req.params.id
await productModel.findByIdAndUpdate({_id:productID})
res.send({"msg":`product with id:${productID} has been updated`})
})

module.exports={productRouter}