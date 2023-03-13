const jwt=require("jsonwebtoken")
const fs=require("fs")
require("dotenv").config()

const authenticate=async(req,res,next)=>{
    var token=req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(401).send("bad requst")
    }
    const blacklistdata=JSON.parse(fs.readFileSync("./blacklistdata.json","utf-8"))
    if(blacklistdata.includes(token)) {
        res.status(200).send("login again")
    }else{
        try {
            let decoded=jwt.verify(token,process.env.mainseckey)
            if(decoded){
                let userrole=decoded.userrole
                req.body.userrole=userrole

                next()
            }else{
                res.status(200).send("login again")
            }
        } catch (error) {
            res.status(200).send("login again")
        }
    }
}

module.exports={authenticate}