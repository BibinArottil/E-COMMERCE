const Wishlist = require("../../Model/user/wishlistModel");
const User = require("../../Model/user/userModel");
const Product = require("../../Model/admin/productModel");
const { default: mongoose } = require("mongoose");

const loadWishlist = async (req, res) => {
  try {
    const existUser = req.session.user;
    const userId = req.session.user;
    const userData = await User.findById(userId);
    const cart = await User.findOne({ _id: userId }).populate("cart.items");
    const cartData = cart.cart.items;
    const proId = req.query.id;
    const wishLenght = await Wishlist.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $unwind: "$products" },
      { $group: { _id: "$products" } },
    ]);
    const cartLenght = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      { $unwind: "$cart.items" },
      { $group: { _id: "$cart.items" } },
    ]);
    const wishData = await Wishlist.findOne({ userId: userId }).populate("products.productId");
    res.render("../Views/user/wishlist.ejs", {
      wishDetails: wishData.products,
      existUser,
      cartData,
      cartLenght,
      wishLenght,
      userData,
    });
  } catch (error) {
    console.log(error);
  }
};

const wishTocart = async (req, res) => {
  try {
    const userId = req.session.user;
    const id = req.query.id;
    const product = await Product.findById(id);
    const productExist = await User.findOne({
      _id: userId,
      "cart.items": { $elemMatch: { productId: id } },
    });
    if (productExist) {
      await User.updateOne(
        { _id: userId, "cart.items": { $elemMatch: { productId: id } } },
        {
          $inc: {
            "cart.items.$.qty": 1,
            "cart.items.$.price": product.price,
            "cart.totalPrice": product.price,
          },
        }
      ); //true
      // await Wishlist.updateOne(
      //   { userId: userId, products: { $elemMatch: { productId: id } } },
      //   { $pull: { products: { productId: id } } }
      // ); //true
      res.redirect("/wishlist");
    } else {
      await User.updateOne(
        { _id: userId },
        { $push: { "cart.items": { productId: id, price: product.price } } }
      );
      await User.updateOne(
        { _id: userId },
        { $inc: { "cart.totalPrice": product.price } },
        { $set: { "cart.totalPrice": product.price } }
      ); //true
      // await Wishlist.updateOne(
      //   { userId: userId, products: { $elemMatch: { productId: id } } },
      //   { $pull: { products: { productId: id } } }
      // ); //true
      res.redirect("/wishlist");
    }
    // await User.updateOne({_id:userId},{$push:{"cart.items":{productId:id, price: product.price }}})
    // await Wishlist.updateOne({userId:userId,products: {$elemMatch : {productId:id}}},{$pull:{products:{productId:id}}})   //true
    // res.redirect('/wishlist')
  } catch (error) {
    console.log(error);
  }
};

const deleteWish = async (req, res) => {
  try {
    const userId = req.session.user;
    const id = req.query.id;
    await Wishlist.updateOne(
      { userId: userId },
      { $pull: { products: { productId: id } } }
    );
    res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const id = req.session.user;
    const proId = req.query.id;
    const existUser = await Wishlist.findOne({ userId: id });
    const wishlistExist = await Wishlist.findOne({
      userId: id,
      products: { $elemMatch: { productId: proId } },
    });
    if (existUser) {
      await Wishlist.updateOne(
        { userId: id },
        { $push: { products: { productId: proId } } }
      );
      res.redirect("/wishlist");
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
  wishTocart,
  deleteWish,
};
