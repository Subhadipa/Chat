const user = require("../../Models/user")

const createUser=async(req,res)=>{
    try{
       let userDetails=await user.create(req.body)
       if(userDetails){
        return res.status(200).send({status:true,message:"User created successfully!",data:userDetails})
       }else{
        return res.status(400).send({status:false,message:"User can't be created!"})
       }
    }catch(error){
        return res.status(500).send({status:false,message:"Server error!"})
    }

}

module.exports={createUser}