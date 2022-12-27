const User=require("../Model/user/userModel")
const mailer=require('../Utils/otp')
const bcrypt=require('bcrypt')

const userLogin=(req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('../Views/user/userLogin.ejs')
    }
}

// const userHome=(req,res)=>{
//     if(req.session.user){
//         res.render('../Views/user/home.ejs')
//     }else{
//         res.redirect('/')
//     }
// }

const loadSignUp=(req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('../Views/user/userSignUp.ejs')
    }
}

const insertUser=async(req,res)=>{
    try {
        userData=req.body
        const email=req.body.email;
        // const user=await User.findOne({email:email})
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
            const passwordHash=await bcrypt.hash(userData.password,10)
            const user1=new User({
                name:userData.name,
                phone_no:userData.phone_no,
                email:userData.email,
                password:passwordHash
            })
            // user1=new User(userData)
            await user1.save()
            res.redirect('/user_login')
        }else{
            res.render('../Views/user/otp.ejs',{error:"Invalid OTP"})
        }
    } catch (error) {
        console.log(error);
    }
    // res.render("../Views/user/otp.ejs")
}

const userVerification=async(req,res)=>{
  try {
    let email=req.body.email
    let password=req.body.password

    const user=await User.findOne({email:email})
    if(user){
        // if(email==user.email && password==user.password){
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(email==user.email && passwordMatch==true){
            req.session.user=req.body.email
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

const loadHome=(req,res)=>{
    validUser=req.session.user
    if(req.session.user){
        console.log("logined");
        res.render('../Views/user/home.ejs',{validUser})
    }else{
        console.log("Not logined");
        res.render('../Views/user/home.ejs',{validUser})
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