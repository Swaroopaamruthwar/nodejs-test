const express = require("express");
const app = express();
const User = require("../models/user");
const router = express.Router();
app.use(express.json());
const bcrypt = require("bcrypt");
app.use(express.urlencoded());
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const jwt = require("jsonwebtoken");
router.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedpass = await bcrypt.hash(password, 10);
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ status: "failed", message: err.message });
  }
  if (!email || !password || !name) {
    res.status(400).json({ status: "failed", message: err.message });
  }
  try {
    const newUser = new User({
      name: name,
      email: email,
      password: hashedpass,
    });
    const result = await newUser.save();
    res.status(201).json({ status: "success", result });
  } catch {
    res.status(500).json({
      status: "failed",
      message: "no login or password, or they are not a strings",
    });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        status: "failed",
        message: "no user with such login, password doesn't match actual one",
      });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      res.status(401).json({ message: err.message });
    }
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.status(201).json({ status: "sucess", token: token });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = router;
