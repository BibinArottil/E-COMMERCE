const mongoose=require('mongoose')
const { schema } = require('./userModel')

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:{ },
    address:{
        addresstype:String,
        name:String,
        address:String,
        district:String,
        state:String,
        country:String,
        pin:Number,
        mobile:Number,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    order:String,
    status:{
        type:String,
        default:"Processing"
    },
    couponUsed:{
        type:mongoose.Types.ObjectId,
        default:null
    }
    
})

const Order=mongoose.model('Order',orderSchema)
module.exports=Order