const sessions = require("express-session");

const session = sessions({
  resave: false,
  saveUninitialized: true,
  secret: "secretpassword",
});

const cache = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
};

module.exports = {
  session,
  cache,
};
