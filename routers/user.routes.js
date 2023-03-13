const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();
const  {userModel} = require("../models/users.model");
const  {authenticate} = require("../middlewares/authenticate.middleware");
const  {authorise} = require("../middlewares/authorise.middleware");
const {disconnect} = require("process")
const userRouter = express.Router();


userRouter.post("/signup",async(req,res)=>{
   
    try {
        const {name,email,password,role}=req.body

        const user=await userModel.findOne({email:email})
        if(user){
             res.status(200).send("youser are alredy registered")
         }else{
             bcrypt.hash(password,5,async(err,hash)=>{
                 const main = new userModel({
                    name,
                    email,
                     password:hash,
                     role
             })
                await main.save();
                res.status(200).send("register successfully")
             });
         }
     } 
    
    catch (error) {
        console.log(error)
        res.status(401).send("bad requst")
    }
})

//////////log in ///////////
userRouter.post('/login', async(req, res) => {
    try {
        const { email, password} = req.body;

        //find the user by username
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({message : 'Invalid user name'})
        } 
        
        //comparing the password enterd by user
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "Invalid password"})
        }
        // if username and password match from DB we'll create JWT token
        const token = jwt.sign({userId: user._id}, process.env.mainseckey, {
            expiresIn: 60
        })

        //Create Refresh JWT token
        const refreshToken = jwt.sign({userId: user._id}, process.env.refseckey, {
            expiresIn : 300
        })

        res.json({message: "Login Successful", token, refreshToken})
    } catch (error) {
        console.log(error)
    }
})

//////////log out ///////////
userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    const blacklistdata=JSON.parse(fs.readFileSync("./blacklistdata.json","utf-8"))
    blacklistdata.push(token)
    fs.writeFileSync("./blacklistdata.json",JSON.stringify(blacklistdata))
    res.status(200).send("user loged out succesfully")
})
//////////////////
userRouter.get("/getnewtoken",async(req,res)=>{
    var reftoken=req.header.authorization?.split(" ")[1]
    if(!reftoken){
        res.status(200).send("login again")

    }else{
        jwt.verify(reftoken, process.env.refseckey,async(error,decoded)=>{
            if(error){
                console.log(error);
                res.status(200).send("login again")
            }else if(decoded){
                let user=decoded
                var maintoken = jwt.sign({userID:user.userID,userrole:user.userrole}, process.env.mainseckey,{expiresIn:60});
                res.send (200).send({"message":"user login succesfully",maintoken:maintoken}) 
            }else{
                console.log("error");
                res.status(200).send("login again")
            }
        });
    }
})


// userRouter.get("/products",authenticate,async(req,res)=>{
//     res.status(200).send("")
// })

// userRouter.get("/userstats",authenticate,authorise(["seller"]),async(req,res)=>{
//     res.status(200).send("her i")
// })


module.exports={userRouter}