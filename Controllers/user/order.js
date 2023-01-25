const User=require('../../Model/user/userModel')
const Order=require('../../Model/user/orderModel')
const Wishlist=require("../../Model/user/wishlistModel")
const { resolve } = require("path");
const { default: mongoose } = require('mongoose');
const { log } = require('console');

const loadOrder=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userId=req.session.user
        const orderId=req.query.id
        const userData=await User.findById(userId)
        const newOrder=await Order.findById(orderId)
        const orderTest = await Order.findOne({ user: userId }).populate("products.items.productId");
        const orderList=await Order.aggregate([{$match:{user:userId}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
      
        const orderData=await Order.aggregate([
            {$match:{user:mongoose.Types.ObjectId(userId)}},
                {$project:{
                    date:"$date",
                    status:"$status",
                    qty:"$products.qty",
                    price:"$products.price",
                    productname:"$products.productname",
                    image:"$products.image",
                    productprice:"$products.productprice",
                    address:"$address",
                    items:"$products.items",
                    total:"$products.totalPrice"
                }}
        ])
        res.render('../Views/user/orderlist.ejs',{orderData,userData,newOrder,wishLenght,cartLenght,existUser,orderTest})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const orderView=async(req,res)=>{
    try {
        const existUser=req.session.user
        const orderId=req.query.id
        const userData=await User.findById(existUser)
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(existUser)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(existUser)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const newOrder=await Order.findById(orderId)
        const orderData=await Order.aggregate([
            {$match:{_id:mongoose.Types.ObjectId(orderId)}},
            {$unwind:"$products"},
       
                {$project:{
                    qty:"$products.qty",
                    price:"$products.price",
                    productname:"$products.productname",
                    image:"$products.image",
                    productprice:"$products.productprice",
                    address:"$address",
                    total:"$products.totalPrice"
                }}
        ])
     
        res.render('../Views/user/orderview.ejs',{orderData,newOrder,cartLenght,wishLenght,userData,existUser})
    } catch (error) {
        console.log(error);
        res.redirect('/server-error')
    }
}

const orderCancel=async(req,res)=>{
    try {
        const orderId=req.query.id
        await Order.updateOne({_id:orderId},{$set:{status:"Cancel"}})
        res.redirect('/order-view?id='+orderId)
    } catch (error) {
        console.log(error);
        res.redirect('/server-error')
    }
}

module.exports={
    loadOrder,
    orderView,
    orderCancel
}