// const session = require('express-session')
const { name } = require('ejs')
const { default: mongoose } = require('mongoose')
const User=require('../../Model/user/userModel')
const Order=require('../../Model/user/orderModel')

const loadCheckout=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const userData=await User.findById(userId)
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        const items=await User.updateOne({_id:userId},{$set:{"cart.totalItems":cartLenght.length}})
        const address=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},
            {$unwind:"$address"},
            {$project:{
                addresstype:"$address.addresstype",
                name:"$address.name",
                address:"$address.address",
                district:"$address.district",
                state:"$address.state",
                country:"$address.country",
                pin:"$address.pin",
                mobile:"$address.mobile",
                id:"$address._id"
        }}
        ])
        const price=await User.findOne({_id:userId}).populate("cart.items.price")
        const cart=await User.findOne({_id:userId}).populate("cart.items.productId")
        const totalPrice=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.itmes",totalPrice:{$sum:"$cart.items.price"}}}])
        cartData=cart.cart.items
        res.render('../Views/user/checkout.ejs',{existUser,cartData,price,userData,address,totalPrice,cartLenght})
    } catch (error) {
        console.log(error);
    }
}

const addressForm=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const addId=req.body.id
        const userData=await User.findById(userId)
        const address=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},
            {$unwind:"$address"},
            {$match:{"address._id":mongoose.Types.ObjectId(addId)}},
        //     {$project:{
        //         addresstype:"$address.addresstype",
        //         name:"$address.name",
        //         address:"$address.address",
        //         district:"$address.district",
        //         state:"$address.state",
        //         country:"$address.country",
        //         pin:"$address.pin",
        //         mobile:"$address.mobile",
        //         id:"$address._id"
        // }}
        ])
        // const price=await User.findOne({_id:userId}).populate("cart.items.price")
        // const cart=await User.findOne({_id:userId}).populate("cart.items.productId")
        // cartData=cart.cart.items
        res.json({
            data:address
        })
    } catch (error) {
        console.log(error);
    }
}

const paypal=require('paypal-rest-sdk')
require('dotenv').config()

paypal.configure({
    'made':'sandbox',
    'client_id':process.env.CLIENT_ID,
    'client_secret':process.env.CLIENT_SECRET
})

const paymentSuccess=async(req,res)=>{
    try {
        let price= parseInt(req.body.totalPrice) 
        if(req.body.type=="COD"){
            const userId=req.session.user
            const user=await User.findById(userId).populate("cart.items")
            orderObj={
                user: userId,
                products: user.cart,
                address:{
                    addresstype:req.body.addtype,
                    name:req.body.name,
                    address:req.body.address,
                    district:req.body.district,
                    state:req.body.state,
                    country:req.body.country,
                    pin:req.body.pin,
                    mobile:req.body.mobile
                },
                date:Date.now(),
                order:req.body.type
            }
            const order=new Order(orderObj)
            await order.save()
            await User.updateOne({_id:userId},{$set:{"cart":{}}})
            res.render('../Views/user/paymentsuccess.ejs',{order})
        }else{
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:5050/paypalsuccess",
                    "cancel_url": "http://localhost:5050/checkout"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": price,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total":price
                    },
                    "description": "This is the payment description."
                }]
            };
            paypal.payment.create(create_payment_json, async function (error, payment) {
                if (error) {
                  throw error;
                } else {
                  for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                      res.redirect(payment.links[i].href);
        
                        }
                  }
                }
              });
        }
        const userId=req.session.user
        const user=await User.findById(userId).populate("cart.items")
        orderObj={
            user: userId,
            products: user.cart,
            address:{
                addresstype:req.body.addtype,
                name:req.body.name,
                address:req.body.address,
                district:req.body.district,
                state:req.body.state,
                country:req.body.country,
                pin:req.body.pin,
                mobile:req.body.mobile
            },
            date:Date.now(),
            order:req.body.type
        }
    } catch (error) {
        console.log(error);
    }
}

const paypalSuccess=async(req,res)=>{
       try {
        const userId=req.session.user
        const order=new Order(orderObj)
        await order.save()
        await User.updateOne({_id:userId},{$set:{"cart":{}}})
        console.log("paypal successs");
    res.render('../Views/user/paymentsuccess.ejs',{order})
       } catch (error) {
        console.log(error);
       }
}

module.exports={
    loadCheckout,
    addressForm,
    paymentSuccess,
    paypalSuccess
}