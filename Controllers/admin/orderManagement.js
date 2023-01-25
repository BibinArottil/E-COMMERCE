const { default: mongoose } = require('mongoose');
const Order = require('../../Model/user/orderModel');

//html to pdf generate requirements
const ejs=require('ejs')
const pdf=require('html-pdf')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const { response } = require('express');

const loadOrder=async(req,res)=>{
    try {
        const orderList=await Order.aggregate([
                {$project:{
                    date:"$date",
                    status:"$status",
                    order:"$order",
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
        res.render('../Views/admin/ordermanagement.ejs',{orderList})
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

const statusUpdate=async(req,res)=>{
    try {
        const orderId=req.body.id
        await Order.updateOne({_id:orderId},{$set:{status:req.body.value}})
        res.redirect('/order-manage')
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

const orederView=async(req,res)=>{
    try {
        const orderId=req.query.id
        const order=await Order.aggregate([{$match:{_id:mongoose.Types.ObjectId(orderId)}},
            {$unwind:"$products"},
            {$project:{
                qty:"$products.qty",
                price:"$products.price",
                productname:"$products.productname",
                image:"$products.image",
                productsprice:"$products.productprice",
                total:"$products.totalPrice",
                address:"$address"
            }}
        ])
        const user=await Order.findById(req.query.id).populate("user")
        res.render('../Views/admin/orderview.ejs',{order,user})
    } catch (error) {
        console.log(error);
        res.redirect('/admin-error')
    }
}

const pdfData=async(req,res)=>{
    try {
        const salesDate=req.body
        const startDate=new Date(salesDate.from)
        const endDate=new Date(salesDate.to)
        const orderData=await Order.find({ $and: [ { date: {$gte: startDate, $lte : endDate} },{status: "Delivered"}]})
        const total=orderData.reduce((acc,curr)=>{
            acc=acc+curr.totalAmount
            return acc
        },0)
        res.render('../Views/admin/pdfDownload.ejs',{orderData,total})
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

module.exports={
    loadOrder,
    statusUpdate,
    orederView,
    pdfData
}