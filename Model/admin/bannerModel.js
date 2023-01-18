const mongoose=require("mongoose")

const bannerSchema=new mongoose.Schema({
    image:String,
    name:String,
    status:{
        type:Boolean,
        default:true
    }
})

const Banner=mongoose.model("Banner",bannerSchema)
module.exports=Banner