const Product=require('../../Model/admin/productModel')
const User=require('../../Model/user/userModel')
const { default: mongoose } = require('mongoose')

const viewProduct=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const id=req.query.id
        const userData=await User.findById(userId)
        const product=await Product.findById(id)
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        res.render('../Views/user/productdetails.ejs',{product,existUser,cartLenght,userData})
    } catch (error) {
        console.log(error);
    }
  
}

module.exports={
    viewProduct
}