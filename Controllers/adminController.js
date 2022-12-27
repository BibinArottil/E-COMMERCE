const Admin = require("../Model/admin/adminModel");
const Category = require("../Model/admin/categoryModel");
const User = require("../Model/user/userModel");
const Product=require("../Model/admin/productModel")

const adminLogin = (req, res) => {
    if(req.session.admin){
        res.redirect('/adminhome')
    }else{
        res.render("../Views/admin/adminLogin.ejs");
    }
};

const adminVerification = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      if (email === admin.email && password === admin.password) {
        req.session.admin=req.body.email
        console.log(req.session.admin);
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
    res.redirect("/user_manage");
  } catch (error) {
    console.log(error);
  }
};

const loadAdminHome = (req, res) => {
    res.render('../Views/admin/adminhome.ejs')
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
  }
};

const insertCategory = (req, res) => {
  try {
    let category = new Category({name: req.body.category});
    category.save();
    res.redirect("/category");
  } catch (error) {
    console.log(error);
  }
};

const editCategory = async (req, res) => {
  try {
    let id = req.query.id;
    const categoryData = await Category.findById({ _id: id });
    if (categoryData) {
      res.render("../Views/admin/editcategory.ejs", { category: categoryData });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
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
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    await Category.findByIdAndUpdate(
      { _id: id },
      { $set: { name: req.body.name } }
    );
    res.redirect("/category");
  } catch (error) {
    console.log(error);
  }
}

const deleteCategory=async(req,res)=>{
    try {
        await Category.findByIdAndDelete({_id:req.query.id})
        res.redirect('/category')
    } catch (error) {
        console.log(error);
    }
    
}

const product=(req,res)=>{
    try {
        Product.find({},(err,productDetails)=>{
            if(err){
                console.log(err);
            }else{
                res.render('../Views/admin/product.ejs',{details:productDetails})
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const insertProduct=(req,res)=>{
  try {
    let product=new Product({
      image:req.file.filename,
      name:req.body.name,
      category:req.body.category,
      description:req.body.description,
      price:req.body.price,
      stock:req.body.stock
    })
    product.save()
    res.redirect('/product')
  } catch (error) {
    console.log(error);
  }
}

const adminLogout=(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
    console.log("admin session destroy");
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
  deleteCategory,
  updateCategory,
  product,
  insertProduct,
  adminLogout
};
