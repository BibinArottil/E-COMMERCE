const { default: mongoose } = require('mongoose')
const { exists } = require('../../Model/admin/coupenModel')
const Coupon=require('../../Model/admin/coupenModel')
const User=require("../../Model/user/userModel")

const couponCheck=async(req,res)=>{
    try {
        const userId=req.session.user
        const code=req.body.input.toUpperCase()
        let total=req.body.total
        total=parseInt(total)
        await Coupon.findOne({code:code}).then((couponExist)=>{
            
            if(couponExist){
                let currentDate=new Date()
                if(currentDate >= couponExist.createdate && currentDate <= couponExist.expiredate){
                    let id=req.session.user
                    id=mongoose.Types.ObjectId(req.session.user)
                    Coupon.findOne({code:code},{users:{$elemMatch:{userId:id}}}).then((exist)=>{
                        if(exist.users.length===0){
                            if(total>=couponExist.minpurchaseamount){
                                res.json({couponApplied:couponExist})
                            }else{
                                let minpurchaseamount=couponExist.minpurchaseamount
                                res.json({minpurchaseamount})
                            }
                        }else{
                            res.json({userUsed:true})
                        }
                    })
                }else{
                    res.json({expired:true})
                }
            }else{
                res.json({notExist:true})
            }
        })
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

module.exports={
    couponCheck
}