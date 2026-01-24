import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";

// User import
import userAuthRouter from "./routers/User/userAuthRouter.js";
import cardRouter from "./routers/User/cardRouter.js";
import orderRouter from "./routers/User/orderRouter.js";

// Admin import
import productRouter from "./routers/Admin/ProductRouter.js";

// Public import
import publicProductRouter from "./routers/public/publicProductRouter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

//User Router
app.use("/API/V1/User", userAuthRouter);
app.use("/API/V1/Cart", cardRouter);
app.use("/API/V1/Order", orderRouter);

//Admin Router
app.use("/API/V1/Admin", productRouter);

//Public Router
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
