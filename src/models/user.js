import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "Last name must be at least 2 characters long"],
      maxLength: [50, "Last name must be less than 50 characters"],
    },
    email: {
      type: String,
      unique: [true, "Email address already exists"],
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id, role: user.role },
    process.env.PRIVATEKEY,
    {
      expiresIn: "1h",
    },
  );
  return token;
};

userSchema.methods.comparePassword = async function (userEnterPassword) {
  const user = this;

  const isPasswordCorrect = await bcrypt.compare(
    userEnterPassword,
    user.password,
  );
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
