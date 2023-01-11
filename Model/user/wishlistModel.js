const mongoose=require('mongoose')

const wishlistSchema=new mongoose.Schema({
        userId:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true
        },
        products:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'Product',
                required:true
            }
        }]
    })

const Wishlist=mongoose.model('Wishlist',wishlistSchema)
module.exports=Wishlist