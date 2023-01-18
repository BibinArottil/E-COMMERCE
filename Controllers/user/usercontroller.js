const User=require("../../Model/user/userModel")
const Product=require("../../Model/admin/productModel")
const Wishlist=require("../../Model/user/wishlistModel")
// const Category=require("../../Model/admin/categoryModel")
const mailer=require('../../Utils/otp')
const bcrypt=require('bcrypt')
const { default: mongoose } = require("mongoose")
const Banner = require("../../Model/admin/bannerModel")

const userLogin=(req,res)=>{
    res.render('../Views/user/userLogin.ejs')
}

const loadSignUp=(req,res)=>{
    res.render('../Views/user/userSignUp.ejs')
}

const insertUser=async(req,res)=>{
    try {
        userData=req.body
        const email=req.body.email;
        const user=await User.findOne({email})
        if(user){
            res.render('../Views/user/userSignUp.ejs',{error:"E-mail already exist"})
        }else{
            
            let mailDetails={
                from:'techinfobibin@gmail.com',
                to:req.body.email,
                subject:'CLICK-BUY REGISTRATION',
                html:`<p>Your OTP for registering in CLICK-BUY is ${mailer.OTP}</p>`,
            }
            console.log(mailer.OTP);
            mailer.mailTransporter.sendMail(mailDetails,(err,data)=>{ 
                console.log(data)
                if(err){
                    console.log(err,'error');
                }else{
                    res.render('../Views/user/otp.ejs')
                    console.log('OTP mailed');
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const otpVerfication=async(req,res)=>{
    try {
        if(req.body.otp==mailer.OTP){
            console.log(userData.email);
            // const passwordHash=await bcrypt.hash(userData.password,10)
            const passwordHash=await bcrypt.hash(userData.password,10)
            const user1=new User({
                name:userData.name,
                phone_no:userData.phone_no,
                email:userData.email,
                password:passwordHash
            })
            await user1.save()
            res.redirect('/user-login')
        }else{
            res.render('../Views/user/otp.ejs',{error:"Invalid OTP"})
        }
    } catch (error) {
        console.log(error);
    }
}

const userVerification=async(req,res)=>{
  try {
    let email=req.body.email
    let password=req.body.password

    const user=await User.findOne({email:email})
    if(user){
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(email==user.email && passwordMatch==true){
            req.session.user=user._id
            console.log("user session created");
            res.redirect('/')
        }else{
            res.render('../Views/user/userLogin.ejs',{wrong:"Invalid Email or password"})
        }
    }else{
        res.render('../Views/user/userLogin.ejs',{wrong:"User not found"})
    }
  } catch (error) {
    console.log(error);
  }
}

const loadHome=async(req,res)=>{
        try {
            existUser=req.session.user
            const userId=req.session.user
            const userData=await User.findById(userId)
            // const cart= await User.findOne({_id:userId}).populate("cart.items.productId")
            // const cartData=cart.cart.items
            const wishLenght=await Wishlist.aggregate([{$match:{userId:mongoose.Types.ObjectId(userId)}},{$unwind:"$products"},{$group:{_id:"$products"}}])
            const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
            const banner=await Banner.find({status:true})
            await Product.find({status:true}).sort({_id:-1}).then((result)=>{
                res.render('../Views/user/home.ejs',{details:result,existUser,cartLenght,wishLenght,userData,banner})
            }).catch((error)=>{
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }   
}

const userSignUp=(req,res)=>{
    res.render('../Views/user/userSignUp.ejs')
}

const userLogout=(req,res)=>{
    req.session.destroy()
    console.log("user session destroy");
    res.redirect('/')
}

module.exports={
    userLogin,
    loadSignUp,
    insertUser,
    userSignUp,
    otpVerfication,
    loadHome,
    userVerification,
    userLogout
}