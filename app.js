const express = require("express");
const app = express();
const userPageRouter = require("./Routes/userRoute");
const adminPageRouter = require("./Routes/adminRoute");
const sessions = require('./Utils/session')

require("dotenv").config()
require("./Config/connection")

app.use(sessions.session)
app.use(sessions.cache)

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(userPageRouter);
app.use(adminPageRouter);

app.use("/Public", express.static(__dirname + "/Public"));

const port = process.env.PORT
app.listen(port, () => console.log(`Server is running at  http://localhost:${port}`))


