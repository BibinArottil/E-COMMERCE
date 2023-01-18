const { default: mongoose } = require('mongoose');
const Order = require('../../Model/user/orderModel');

const loadOrder=async(req,res)=>{
    try {
        const orderList=await Order.find()
        res.render('../Views/admin/ordermanagement.ejs',{orderList})
    } catch (error) {
        console.log(error);
    }
}

const statusUpdate=async(req,res)=>{
    try {
        const orderId=req.body.id
        await Order.updateOne({_id:orderId},{$set:{status:req.body.value}})
        res.redirect('/order-manage')
    } catch (error) {
        console.log(error);
    }
}

const orederView=async(req,res)=>{
    try {
        const orderId=req.query.id
        const order=await Order.aggregate([{$match:{_id:mongoose.Types.ObjectId(orderId)}},
            {$unwind:"$products.items"},
            {$lookup:{
                from:"products",
                localField:"products.items.productId",
                foreignField:"_id",
                as:"order_data"
            }},
            {$project:{
                qty:"$products.items.qty",
                price:"$products.items.price",
                productname:"$order_data.name",
                image:"$order_data.image",
                productsprice:"$order_data.price",
                total:"$products.totalPrice",
                address:"$address"
            }}
        ])
        // console.log(order);
        const user=await Order.findById(req.query.id).populate("user")
        // console.log(user);
        res.render('../Views/admin/orderview.ejs',{order,user})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadOrder,
    statusUpdate,
    orederView
}