const mongoose=require("mongoose")
const User= new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },   
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        }

    },
    {
        timestamps:true
    }
)
module.exports=mongoose.model(
    "User",User
)