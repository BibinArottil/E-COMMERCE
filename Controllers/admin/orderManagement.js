const Order = require('../../Model/user/orderModel');

const loadOrder=async(req,res)=>{
    try {
        const orderList=await Order.find()
        // console.log(orderList);
        res.render('../Views/admin/ordermanagement.ejs',{orderList})
    } catch (error) {
        console.log(error);
    }
}

const statusUpdate=async(req,res)=>{
    try {
        const orderId=req.body.id
        const data=req.body.value
        await Order.updateOne({_id:orderId},{$set:{status:req.body.value}})
        res.redirect('/order-manage')
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadOrder,
    statusUpdate
}