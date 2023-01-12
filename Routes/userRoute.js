const express = require("express");
const user_route = express.Router();
const auth=require('../Middleware/user/usersession')

const userRouter = require("../Controllers/user/usercontroller");
user_route.get("/",userRouter.loadHome);
user_route.post("/",userRouter.userVerification)
user_route.get("/user-login",auth.userLogout,userRouter.userLogin);
user_route.get("/signup",auth.userLogout,userRouter.loadSignUp);
user_route.post("/signup",userRouter.insertUser)
user_route.post("/otp",userRouter.otpVerfication)
user_route.get('/user-logout',userRouter.userLogout)

const profile=require('../Controllers/user/profile')
user_route.get('/profile',auth.userLogin,profile.loadProfile)
user_route.get('/address',profile.loadAddress)
user_route.get('/edit-profile',profile.editProfile)
user_route.get('/change-password',profile.changePassword)
user_route.post('/update-password',profile.updatePassword)
user_route.post('/update-profile',profile.updateProfile)
user_route.post('/add-address',profile.addAddress)
user_route.get('/delete-address',profile.deleteAddress)

const cart=require('../Controllers/user/cart')
user_route.get("/add-tocart",cart.addTOCart)
user_route.get('/cart',cart.viewCart)
user_route.put('/cart-incQty',cart.incQty)
user_route.get('/cart-delete',cart.deleteCart)
user_route.put('/cart-decQty',cart.decQty)

const wishlist=require('../Controllers/user/wishlist')
user_route.get('/wishlist',wishlist.loadWishlist)
user_route.get('/add-towishlist',wishlist.addToWishlist)
user_route.get('/wish-tocart',wishlist.wishTocart)
user_route.get('/wish-delete',wishlist.deleteWish)

const product=require('../Controllers/user/productDetails')
user_route.get('/view-product',product.viewProduct)

const shop=require('../Controllers/user/shop')
user_route.get('/shop',shop.loadShop)

const checkout=require('../Controllers/user/checkout')
user_route.post('/checkout',checkout.loadCheckout)
user_route.put('/checkout',checkout.addressForm)
user_route.post('/payment',checkout.paymentSuccess)
user_route.get('/paypalsuccess',checkout.paypalSuccess)

const order=require('../Controllers/user/order')
user_route.get('/order',order.loadOrder)

module.exports = user_route;