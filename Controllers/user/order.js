const User=require('../../Model/user/userModel')
const Order=require('../../Model/user/orderModel')
const { resolve } = require("path");
const { default: mongoose } = require('mongoose');
const { log } = require('console');

const loadOrder=async(req,res)=>{
    try {
        const userId=req.session.user
        const userData=await User.findById(userId)
        const orderList=await Order.aggregate([{$match:{user:userId}}])
        console.log(orderList,"@@@@@@@@@");
        const order=await Order.find({user:userId})
        const orderData=await Order.aggregate([
            {$match:{user:mongoose.Types.ObjectId(userId)}},
            {$unwind:"$products.items"},
            {$lookup:
                {from:"products",
                localField:"products.items.productId",
                foreignField:"_id",
                as:"order_data"}},
                {$project:{
                    qty:"$products.items.qty",
                    price:"$products.items.price",
                    productname:"$order_data.name",
                    image:"$order_data.image",
                    productprice:"$order_data.price",
                    address:"$address",
                    total:"$products.totalPrice"
                }}
        ]) 
        console.log(orderData,'&&&&&&&')
        res.render('../Views/user/order.ejs',{orderData,userData,order})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadOrder
}