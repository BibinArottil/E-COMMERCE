const Admin = require("../../Model/admin/adminModel");
const Category = require("../../Model/admin/categoryModel");
const User = require("../../Model/user/userModel");
const Product=require("../../Model/admin/productModel");
const Order = require("../../Model/user/orderModel");

const adminLogin = (req, res) => { 
  try {
    res.render("../Views/admin/adminLogin.ejs");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const adminVerification = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      if (email === admin.email && password === admin.password) {
        req.session.admin=admin._id
        console.log("admin session created");
        res.redirect("/adminhome");
      } else {
        res.render("../Views/admin/adminLogin.ejs", {
          wrong: "Invalid Email or password",
        });
      }
    } else {
      res.render("../Views/admin/adminLogin.ejs", { wrong: "Admin not found" });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const loadUser = async (req, res) => {
    try {
      User.find({}, (err, userdetails) => {
        if (err) {
          console.log(err);
        } else {
          res.render("../Views/admin/userManagement.ejs", {details: userdetails});
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect('/errorAdmin')
    }
};

const updateUser = async (req, res) => {
  try {
    const check = await User.findById({ _id: req.query.id });
    if (check.status == true) {
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
    } else {
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
    }
    res.redirect("/user-manage");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const loadAdminHome = async (req, res) => {
  try {
      const customers=await User.count()
      const products=await Product.count()
      const totalOrder=await Order.count()
      const total=await Order.find()
      const totalRevenue=total.reduce((acc,curr)=>{
        acc=acc+curr.totalAmount
        return acc
      },0)
      const packed=await Order.count({status:"Packed"})
      const processing=await Order.count({status:"Processing"})
      const shipped=await Order.count({status:"Shipped"})
      const delivered=await Order.count({status:"Delivered"})
      const cancel=await Order.count({status:"Cancel"})
    res.render('../Views/admin/adminhome.ejs',{customers,products,totalOrder,totalRevenue,packed,processing,shipped,delivered,cancel})
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const category = async (req, res) => {
    try {
      Category.find({}, (err, categoryDetails) => {
        if (err) {
          console.log(err);
        } else {
          res.render("../Views/admin/category.ejs", { details: categoryDetails });
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect('/errorAdmin')
    }
};

const insertCategory=async(req,res)=>{
  try {
    const name=req.body.category.toUpperCase()
    const categoryDetails=await Category.find({})
    const existCategory=await Category.findOne({name:name})
    if(existCategory){
      res.render('../Views/admin/category.ejs',{details:categoryDetails,wrong:"This category name already exist"})
    }else{
      const category= new Category({name:name})
      await category.save()
      res.redirect('/category')
    }
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
}

const editCategory = async (req, res) => {
  try {
    let id = req.query.id;
    const categoryData = await Category.findById({ _id: id });
    if (categoryData) {
      res.render("../Views/admin/editcategory.ejs", {category: categoryData });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/admin-error')
  }
};

const listUnlistCategory = async (req, res) => {
  try {
    const check = await Category.findById({ _id: req.query.id });
    if (check.status == true) {
      await Category.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: false } }
      );
    } else {
      await Category.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { status: true } }
      );
    }
    res.redirect("/category");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.body.id;
    await Category.findByIdAndUpdate({ _id: id },{ $set: { name: req.body.name.toUpperCase() } });
    res.redirect("/category");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
}

const product=(req,res)=>{
    try {
      Product.find({},(err,productDetails)=>{
          if(err){
              console.log(err);
          }else{
            Category.find({},(err,categoryDetails)=>{
              if(err){
                console.log(err);
              }else{
                res.render('../Views/admin/product.ejs',{details:productDetails,category:categoryDetails})
              }
            })
          }
      })
  } catch (error) {
      console.log(error);
      res.redirect('/errorAdmin')
  }
}

const insertProduct=async(req,res)=>{
  try {
    let product=new Product({
      image:req.file.filename,
      name:req.body.name,
      category:req.body.category,
      description:req.body.description,
      price:req.body.price,
      stock:req.body.stock
    })
    await product.save()
    res.redirect('/product')
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
}

const listUnlistProduct=async(req,res)=>{
  try {
    const check = await Product.findById({_id:req.query.id})
    if(check.status==true){
      await Product.findByIdAndUpdate({_id:req.query.id},{$set:{status:false}})
    }else{
      await Product.findByIdAndUpdate({_id:req.query.id},{$set:{status:true}})
    }
    res.redirect('/product')
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
}

const editProduct=async(req,res)=>{
  try {
    const id=req.query.id
    const product=await Product.findById({_id:id})
    const categoryDetails=await Category.find()
    if(product){
      res.render('../Views/admin/editproduct.ejs',{product,category:categoryDetails})
    }else{
      res.redirect('/product')
    }
  } catch (error) {
    console.log(error);
    res.redirect('/admin-error')
  }
}

const updateProduct=async(req,res)=>{
  try {
    const id=req.query.id
    if(typeof(req.files==='undefined')){
      await Product.findByIdAndUpdate({_id:id},
        {$set:{
          name:req.body.name,
          category:req.body.category,
          description:req.body.description,
          price:req.body.price,
          stock:req.body.stock
        }})
        res.redirect('/product')
    }else{
      await Product.findByIdAndUpdate({_id:id},
        {$set:{
          image:req.file.filename,
          name:req.body.name,
          category:req.body.category,
          description:req.body.description,
          price:req.body.price,
          stock:req.body.stock
        }})
        res.redirect('/product')
    }
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
}

const adminLogout=(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
    console.log("admin session destroy");
}

const error404=(req,res)=>{
  res.render('../Views/admin/404error.ejs')
}

const error500=(req,res)=>{
  res.render('../Views/admin/500error.ejs')
}

module.exports = {
  adminLogin,
  adminVerification,
  loadAdminHome,
  loadUser,
  updateUser,
  category,
  insertCategory,
  listUnlistCategory,
  editCategory,
  updateCategory,
  product,
  insertProduct,
  listUnlistProduct,
  editProduct,
  updateProduct,
  adminLogout,
  error404,
  error500
};
