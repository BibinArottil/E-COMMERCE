const mongoose=require('mongoose')

const coupenSchema=new mongoose.Schema({
    code:String,
    discount:Number,
    minpurchaseamount:Number,
    createdate:Date,
    expiredate:Date,
    users:[
        {
            userId:mongoose.Types.ObjectId
        }
    ],
    status:{
        type:Boolean,
        default:true
    }
})

const Coupen=mongoose.model('Coupen',coupenSchema)
module.exports=Coupen