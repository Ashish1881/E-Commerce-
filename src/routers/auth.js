const express = require("express");
const User = require("../models/user");
const { validateRegisterData } = require("../Utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

//	POST /auth/register → Create a new user account.

authRouter.post("/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateRegisterData(req);
    const bcryptPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
    });

    const userData = await user.save();
    res.json({
      message: "User Register Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// POST /auth/login → Log in a user and return a JWT.

authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    console.log(user);

    const isCorrectPassword = await user.comparePassword(password);
    const token = await user.getJWT();
    if (isCorrectPassword) {
      res.cookie("token", token);
      res.json({ message: "Login Successfuly" });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
module.exports = authRouter;
