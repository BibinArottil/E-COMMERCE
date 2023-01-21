const Product=require('../../Model/admin/productModel')
const User=require('../../Model/user/userModel')
const Wishlist=require("../../Model/user/wishlistModel")
const { default: mongoose } = require('mongoose')
const Category = require('../../Model/admin/categoryModel')
// const { search } = require('../../Routes/userRoute')

const loadShop=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userId=req.session.user
        const userData=await User.findById(userId)
      
        const category=await Category.find({status:true})
        const product=await Product.find()
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        res.render('../Views/user/shop.ejs',{existUser,product,cartLenght,wishLenght,userData,category})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const searchProduct=async(req,res)=>{
  try {
    const existUser=req.session.user
    const userId=req.session.user
    const userData=await User.findById(userId)
    const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
    const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
    const category=await Category.find({status:true})
    let search=req.query.search
    const product=await Product.find({name:{$regex: ".*"+search+"*.",$options:'i'}})
    if(product.length>0){
      res.render('../Views/user/shop.ejs',{product,wishLenght,cartLenght,userData,category})
    }else{
      res.render('../Views/user/shop.ejs',{userData,existUser,product,wishLenght,cartLenght,category,message:"Product not found!"})
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error')
  }
}

const searchCategory=async(req,res)=>{
  try {
    const existUser=req.session.user
    const userId=req.session.user
    const userData=await User.findById(userId)
    const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
    const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
    const category=await Category.find({status:true})
    let search=req.query.id
    const product=await Product.find({category:search})
    if(product.length>0){
      res.render('../Views/user/shop.ejs',{product,wishLenght,cartLenght,userData,category})
    }else{
      res.render('../Views/user/shop.ejs',{userData,existUser,product,wishLenght,cartLenght,category,message:"Product not found!"})
    }
  } catch (error) {
    console.log(error);
    res.redirect('/server-error')
  }
}

module.exports={
    loadShop,
    searchProduct,
    searchCategory
}