const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
mongoose
  .connect(process.env.url)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
const authRoute = require("./routes/auth");

app.use("", authRoute);
app.listen(3000, () => console.log("app listen 3000"));
