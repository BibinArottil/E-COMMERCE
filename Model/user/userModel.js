const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone_no:Number,
    password:String,
    status:{
        type:Boolean,
        default:true
    },
    cart:{
        items:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'Product',
                required:true
            },
            qty:{
                type:Number,
                default:1,
            },
            price:Number
        }],
        totalPrice:Number,
        totalItems:Number
    },
    address:[{
        addresstype:String,
        name:String,
        address:String,
        district:String,
        state:String,
        country:String,
        pin:Number,
        mobile:Number,
        status:{
            type:Boolean,
            default:false
        }
    }]
})

const User=mongoose.model('User',userSchema)
module.exports=User
