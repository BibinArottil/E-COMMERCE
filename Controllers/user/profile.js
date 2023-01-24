const User=require('../../Model/user/userModel')
const Wishlist=require("../../Model/user/wishlistModel")
const { default: mongoose } = require('mongoose')
const bcrypt=require('bcrypt')
const { findOne } = require('../../Model/admin/bannerModel')

const loadProfile=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userData=await User.findById(existUser)
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(existUser)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(existUser)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
    res.render('../Views/user/profile.ejs',{userData,existUser,cartLenght,wishLenght})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const loadAddress=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userData=await User.findById(existUser)
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(existUser)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(existUser)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        res.render('../Views/user/add-address.ejs',{existUser,userData,wishLenght,cartLenght})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const addAddress=async(req,res)=>{
    try {
        const id=req.session.user
        const addressData=req.body;
       await User.findByIdAndUpdate(id,{$push:{address:{
            addresstype:addressData.addresstype,
            name:addressData.name,
            address:addressData.address,
            district:addressData.district,
            state:addressData.state,
            country:addressData.country,
            pin:addressData.pin,
            mobile:addressData.mobile
       }}})
       res.redirect('/profile')
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const deleteAddress=async(req,res)=>{
    try {
        const addId=req.query.id
        await User.updateOne({_id:req.session.user},{$pull:{address:{_id:addId}}})
        console.log(addId)
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
        res.redirect('/server-error')
    }
}

const editProfile=async(req,res)=>{
    try {
        const existUser=req.session.user
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(existUser)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(existUser)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        const userData=await User.findById(existUser)
        if(userData){
            res.render('../Views/user/edit-profile.ejs',{userData,cartLenght,wishLenght})
        }else{
            res.redirect('/profile')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const updateProfile=async(req,res)=>{
    try {
        const userData=await User.findById(req.session.user)
        const email=req.body.email
        const user=await User.findOne({email})
        if(user){
            res.render('../Views/user/edit-profile.ejs',{userData,wrong:"This email already exist"})
        }else{
            await User.findByIdAndUpdate(req.session.user,{$set:{name:req.body.name,email:req.body.email,phone_no:req.body.phone}})
            res.redirect('/profile')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const changePassword=async(req,res)=>{
    try {
        const existUser=req.session.user
        const userData=await User.findById(existUser)
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(existUser)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
        const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(existUser)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
        res.render('../Views/user/changepassword.ejs',{userData,existUser,cartLenght,wishLenght})
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const updatePassword=async(req,res)=>{
    try {
        const user=await User.findById(req.session.user)
        const passwordMatch=await bcrypt.compare(req.body.currentpassword,user.password)
        if (passwordMatch==true) {
            const passwordHash=await bcrypt.hash(req.body.newpassword,10)
        await User.updateOne({_id:req.session.user},{$set:{password:passwordHash}})
        res.render('../Views/user/changepassword.ejs',{message:"New password updated"})
        }else{
            res.render('../Views/user/changepassword.ejs',{wrong:"Current password not match"})
        }
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

module.exports={
    loadProfile,
    loadAddress,
    addAddress,
    deleteAddress,
    editProfile,
    updateProfile,
    changePassword,
    updatePassword
}