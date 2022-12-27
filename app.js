const express = require("express");
const sessions = require("express-session");
const app = express();
const userPageRouter = require("./Routes/userRoute");
const adminPageRouter = require("./Routes/adminRoute");

// require('./Utils/otp')

app.use(
  sessions({
    resave: true,
    saveUninitialized: true,
    secret: "secretpassword",
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

require("./Model/dbModel");

app.use(userPageRouter);
app.use(adminPageRouter);

app.use("/Public", express.static(__dirname + "/Public"));

app.listen(5050, () => {
  console.log(`Port listening on 5050`);
});
