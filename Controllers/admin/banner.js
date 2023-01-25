const Banner = require("../../Model/admin/bannerModel");

const bannerView = async (req, res) => {
  try {
    const banner = await Banner.find();
    res.render("../Views/admin/banner.ejs", { banner });
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const insertBanner = async (req, res) => {
  try {
    let banner = new Banner({
      image: req.file.filename,
      name: req.body.name,
    });
    await banner.save();
    res.redirect("/banner");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const bannerAction = async (req, res) => {
  try {
    const banner = await Banner.findById(req.query.id);
    if (banner.status == true) {
      await Banner.findByIdAndUpdate(req.query.id, { $set: { status: false } });
    } else {
      await Banner.findByIdAndUpdate(req.query.id, { $set: { status: true } });
    }
    res.redirect("/banner");
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

const editBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.query.id);
    res.render("../Views/admin/editbanner.ejs", { banner });
  } catch (error) {
    console.log(error);
    res.redirect('/admin-error')
  }
};

const updateBanner = async (req, res) => {
  try {
    if (typeof (req.files === "undefined")) {
      await Banner.findByIdAndUpdate(req.body.id, {
        $set: {
          name: req.body.name,
        },
      });
      res.redirect("/banner");
    } else {
      await Banner.findByIdAndUpdate(req.body.id, {
        $set: {
          image: req.file.filename,
          name: req.body.name,
        },
      });
      res.redirect("/banner");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/errorAdmin')
  }
};

module.exports = {
  bannerView,
  insertBanner,
  bannerAction,
  editBanner,
  updateBanner,
};
