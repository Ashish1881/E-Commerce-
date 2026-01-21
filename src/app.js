import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js";

import userAuthRouter from "./routers/User/userAuthRouter.js";
import cookieParser from "cookie-parser";
import productRouter from "./routers/Admin/ProductRouter.js";
import publicProductRouter from "./routers/public/publicProductRouter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/API/V1/User", userAuthRouter);
app.use("/API/V1/Admin", productRouter);

app.use("/API/V1/Public", publicProductRouter);

connectDB()
  .then(() => {
    console.log("Database is connected Successfully");
    app.listen(3000, () => {
      console.log("Server is runing on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database is not connected...");
  });
