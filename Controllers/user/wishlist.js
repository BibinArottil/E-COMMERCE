const Wishlist = require("../../Model/user/wishlistModel");
const User = require("../../Model/user/userModel");
const Product = require("../../Model/admin/productModel");
const { default: mongoose } = require("mongoose");

const loadWishlist = async (req, res) => {
  try {
    const existUser = req.session.user;
    const userData = await User.findById(existUser);
    const cart = await User.findOne({ _id: existUser }).populate("cart.items");
    const cartData = cart.cart.items;
    const wishLenght = await Wishlist.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(existUser) } },
      { $unwind: "$products" },
      { $group: { _id: "$products" } },
    ]);
    const cartLenght = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(existUser) } },
      { $unwind: "$cart.items" },
      { $group: { _id: "$cart.items" } },
    ]);
    const wishData = await Wishlist.findOne({ userId: existUser }).populate(
      "products.productId"
    );
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
    res.redirect('/error')
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
      res.redirect("/wishlist");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error')
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
    res.redirect('/error')
  }
};

const addToWishlist = async (req, res) => {
  try {
    const id = req.session.user;
    const proId = req.query.proId;
    const existUser = await Wishlist.findOne({
      userId: mongoose.Types.ObjectId(id),
    });
    const wishlistExist = await Wishlist.findOne({
      userId: id,
      products: { $elemMatch: { productId: proId } },
    });
    if (existUser) {
      if (wishlistExist) {
        res.json({ wish: true });
      } else {
        await Wishlist.updateOne(
          { userId: id },
          { $push: { products: { productId: proId } } }
        );
        const wishLenght = await Wishlist.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(id) } },
          { $unwind: "$products" },
          { $group: { _id: "$products" } },
        ]);
        const count = wishLenght.length;
        res.json({ success: true, count });
      }
    } else {
      const wishdata = new Wishlist({
        userId: id,
        products: [{ productId: proId }],
      });
      await wishdata.save();
    }
  } catch (error) {
    console.log(error);
    res.redirect('/error')
  }
};

module.exports = {
  loadWishlist,
  addToWishlist,
  wishTocart,
  deleteWish
};
