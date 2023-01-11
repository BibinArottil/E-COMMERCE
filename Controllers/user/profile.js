const User=require('../../Model/user/userModel')
const { default: mongoose } = require('mongoose')
const bcrypt=require('bcrypt')

const loadProfile=async(req,res)=>{
    try {
        existUser=req.session.user
        const userId=req.session.user
        const userData=await User.findById(userId)
        const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
    res.render('../Views/user/profile.ejs',{userData,existUser,cartLenght})
    } catch (error) {
        console.log(error);
    }
}

const loadAddress=async(req,res)=>{
    res.render('../Views/user/add-address.ejs')
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
    }
}

const deleteAddress=async(req,res)=>{
    try {
        const addId=req.query.id
        console.log(addId,'===========');
        await User.updateOne({_id:req.session.user},{$pull:{address:{_id:addId}}})
        console.log(addId)
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
    }
}

const editProfile=async(req,res)=>{
    try {
        const userData=await User.findById(req.session.user)
        if(userData){
            res.render('../Views/user/edit-profile.ejs',{userData})
        }else{
            res.redirect('/profile')
        }
    } catch (error) {
        console.log(error);
    }
}

const updateProfile=async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.session.user,{$set:{name:req.body.name,email:req.body.email,phone_no:req.body.phone}})
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
    }
}

const changePassword=async(req,res)=>{
    res.render('../Views/user/changepassword.ejs')
}

const updatePassword=async(req,res)=>{
    try {
        const passwordHash=await bcrypt.hash(req.body.newpassword,10)
        await User.updateOne({_id:req.session.user},{$set:{password:passwordHash}})
        res.render('../Views/user/changepassword.ejs',{message:"New password updated"})
    } catch (error) {
        console.log(error);
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