const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
    name:String,
    status:{
        type:Boolean,
        default:true
    }
})

const Category=mongoose.model("Cateory",categorySchema)
module.exports=Category