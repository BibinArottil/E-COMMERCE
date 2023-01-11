const Wishlist = require("../../Model/user/wishlistModel");
const User = require("../../Model/user/userModel");
const Product = require("../../Model/admin/productModel");
const { default: mongoose } = require('mongoose')

const loadWishlist = async (req, res) => {
  try {
    const existUser=req.session.user
    const userId = req.session.user;
    const userData=await User.findById(userId)
    const cart= await User.findOne({_id:userId}).populate("cart.items")
    const cartData=cart.cart.items
    const proId = req.query.id;
    const cartLenght=await User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$unwind:"$cart.items"},{$group:{_id:"$cart.items"}}])
    const wishData = await Wishlist.findOne({ userId: userId }).populate("products.productId");
    res.render("../Views/user/wishlist.ejs", { wishDetails:wishData.products,existUser,cartData,cartLenght,userData });
  } catch (error) {
    console.log(error);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const id = req.session.user;
    const proId = req.query.id;
    const existUser = await Wishlist.findOne({ userId: id });
    if (existUser) {
      await Wishlist.updateOne(
        { userId: id },
        { $push: { products: { productId: proId } } }
      );
    } else {
      const wishdata = new Wishlist({
        userId: id,
        products: [{ productId: proId }],
      });
      await wishdata.save();
    }
    res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadWishlist,
  addToWishlist,
};
