import User from "../../models/user.js";
import validateRegisterData from "../../Utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// auth/register → Create a new user account.

export const authRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    validateRegisterData(req);
    const bcryptPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      role,
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
};

// auth/login → Log in a user and return a JWT.

export const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isCorrectPassword = await user.comparePassword(password);
    const token = await user.getJWT();

    if (isCorrectPassword) {
      res.cookie("token", token);
      res.json({ message: "Login Successfuly", role: user.role });
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
};

const authController = {
  authRegister,
  authLogin,
};

export default authController;
