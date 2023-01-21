const User=require('../../Model/user/userModel')
const Order=require('../../Model/user/orderModel')
const Wishlist=require("../../Model/user/wishlistModel")
const { resolve } = require("path");
const { default: mongoose } = require('mongoose');
const { log } = require('console');

const loadOrder=async(req,res)=>{
    try {
        const userId=req.session.user
        const orderId=req.query.id
        const userData=await User.findById(userId)
        const newOrder=await Order.findById(orderId)
        // console.log(newOrder,'8888888888');
        const orderTest = await Order.findOne({ user: userId }).populate("products.items.productId");
        const orderList=await Order.aggregate([{$match:{user:userId}}])
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        // console.log(orderList,"@@@@@@@@@");
        // const order=await Order.find({user:userId})
        // const orderData=await Order.aggregate([{$match:{user:mongoose.Types.ObjectId(userId)}}])
        // console.log(orderTest,'44444444');
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
        res.render('../Views/user/orderlist.ejs',{orderData,userData,newOrder,wishLenght,orderTest})
    } catch (error) {
        console.log(error);
    }
}

const orderView=async(req,res)=>{
    try {
        const userId=req.session.user
        const orderId=req.query.id

        const newOrder=await Order.findById(orderId)
        const orderData=await Order.aggregate([
            {$match:{_id:mongoose.Types.ObjectId(orderId)}},
            {$unwind:"$products"},
            // {$lookup:
            //     {from:"products",
            //     localField:"products.items.productId",
            //     foreignField:"_id",
            //     as:"order_data"}},
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
        // console.log(orderData,'0000000000')
        // console.log(newOrder,'&&&&&&&');
        res.render('../Views/user/orderview.ejs',{orderData,newOrder})
    } catch (error) {
        console.log(error);
    }
}

const orderCancel=async(req,res)=>{
    try {
        const orderId=req.query.id
        // console.log(orderId);
        await Order.updateOne({_id:orderId},{$set:{status:"Cancel"}})
        res.redirect('/order-view?id='+orderId)
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadOrder,
    orderView,
    orderCancel
}