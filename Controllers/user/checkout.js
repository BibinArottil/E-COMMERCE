// const session = require('express-session')
const { name } = require('ejs')
const { default: mongoose } = require('mongoose')
const User=require('../../Model/user/userModel')
const Order=require('../../Model/user/orderModel')
const Wishlist=require("../../Model/user/wishlistModel")
const Coupon=require('../../Model/admin/coupenModel')

const loadCheckout=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userId=req.session.user
        const userData=await User.findById(userId)
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
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
        res.render('../Views/user/checkout.ejs',{existUser,cartData,price,userData,address,totalPrice,cartLenght,wishLenght})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const addressForm=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const addId=req.body.id
        const address=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},
            {$unwind:"$address"},
            {$match:{"address._id":mongoose.Types.ObjectId(addId)}},
        ])
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
        const userId=req.session.user
        if(req.body.couponid===''){
            console.log('coupon not used');
        }else{
            await User.updateOne({_id:userId},{$set:{"cart.totalPrice":req.body.totalpay}})
        }
        const user=await User.aggregate([
            {$match:{_id:mongoose.Types.ObjectId(req.session.user)}},
            {$unwind:"$cart.items"},
            {$lookup:
                {from:"products",
                localField:"cart.items.productId",
                foreignField:"_id",
                as:"order_list"
                }
            },
            {$project:{
                qty:"$cart.items.qty",
                price:"$cart.items.price",
                productname:"$order_list.name",
                image:"$order_list.image",
                productprice:"$order_list.price",
                items:"$cart.totalItems",
                totalPrice:"$cart.totalPrice"
            }}
        ])
        if(req.body.type=="COD"){
            if(req.body.couponid===''){
                OrderCod={
                    user: userId,
                    products: user,
                    subTotal:req.body.subTotal,
                    totalAmount:req.body.totalpay,
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
                    order:req.body.type,
                }
            const order=new Order(OrderCod)
            await order.save()
            await User.updateOne({_id:userId},{$set:{"cart":{}}})
            const userData=await User.findById(userId)
            res.render('../Views/user/paymentsuccess.ejs',{order,userData,userId})
        }else{
            await Coupon.updateOne({_id:req.body.couponid},{$push:{users:{userId:userId}}})
            couponUsedOrderCod={
                user: userId,
                products: user,
                subTotal:req.body.subTotal,
                totalAmount:req.body.totalpay,
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
                order:req.body.type,
                couponUsed:req.body.couponid
            }
            const order=new Order(couponUsedOrderCod)
            await order.save()
            await User.updateOne({_id:userId},{$set:{"cart":{}}})
            const userData=await User.findById(userId)
            res.render('../Views/user/paymentsuccess.ejs',{order,userId,userData})
        }
        
        }else{
            if(req.body.couponid===''){
                let price= parseInt(req.body.subTotal)
                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "https://www.clickbuyshop.store/paypalsuccess",
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
                orderPaypal={
                    user: userId,
                    products: user,
                    subTotal:req.body.subTotal,
                    totalAmount:req.body.totalpay,
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
                req.session.order=orderPaypal
            }else{
                await Coupon.updateOne({_id:req.body.couponid},{$push:{users:{userId:userId}}})
                let price= parseInt(req.body.totalpay)
                await User.updateOne({_id:userId},{$set:{"cart.totalPrice":req.body.totalpay}})
                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "https://www.clickbuyshop.store/paypalsuccess",
                        "cancel_url": "https://www.clickbuyshop.store/cart"
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
                  couponPaypal={
                    user: userId,
                    products: user,
                    subTotal:req.body.subTotal,
                    totalAmount:req.body.totalpay,
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
                    order:req.body.type,
                    couponUsed:req.body.couponid
                }
                req.session.order=couponPaypal
            }
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error')

    }
}

const paypalSuccess=async(req,res)=>{
       try {
        const userId=req.session.user
        const userData=await User.findById(userId)
        const paypal=req.session.order
        const order=new Order(paypal)
        await order.save()
        req.session.order=false
        await User.updateOne({_id:userId},{$set:{"cart":{}}})
    res.render('../Views/user/paymentsuccess.ejs',{order,userId,userData})
       } catch (error) {
        console.log(error);
        res.redirect('/error')
       }
}

module.exports={
    loadCheckout,
    addressForm,
    paymentSuccess,
    paypalSuccess
}

