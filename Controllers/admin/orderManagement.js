const Order = require('../../Model/user/orderModel');

const loadOrder=async(req,res)=>{
    try {
        const orderList=await Order.find()
        console.log(orderList);
        res.render('../Views/admin/ordermanagement.ejs',{orderList})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadOrder
}