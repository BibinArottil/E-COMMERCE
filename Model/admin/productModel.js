const mongoose = require("mongoose");

const productSchema=new mongoose.Schema({
    image:String,
    name:String,
    category:String,
    description:String,
    price:Number,
    stock:Number,
    status:{
        type:Boolean,
        default:true
    }
})

const Product=mongoose.model("Product",productSchema)
module.exports=Product

