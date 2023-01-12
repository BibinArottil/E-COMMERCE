const Product=require('../../Model/admin/productModel')
const User=require('../../Model/user/userModel')
const Wishlist=require("../../Model/user/wishlistModel")
const { default: mongoose } = require('mongoose')

const loadShop=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const userData=await User.findById(userId)
        const product=await Product.find()
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        res.render('../Views/user/shop.ejs',{existUser,product,cartLenght,wishLenght,userData})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadShop
}