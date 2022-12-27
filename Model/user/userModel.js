const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone_no:Number,
    password:String,
    status:{
        type:Boolean,
        default:true
    }
})

const User=mongoose.model('User',userSchema)
module.exports=User