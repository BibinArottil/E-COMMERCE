const express = require("express");
const userRouter = require("../Controllers/usercontroller");
const user_route = express.Router();

user_route.get("/", userRouter.loadHome);

user_route.get("/user_login",userRouter.userLogin);

user_route.get("/signup", userRouter.loadSignUp);

user_route.post("/signup",userRouter.insertUser)

user_route.post("/otp",userRouter.otpVerfication)

user_route.post("/",userRouter.userVerification)

user_route.get('/user_logout',userRouter.userLogout)

module.exports = user_route;