import express from "express";
import cartControllers, {
  AddToCart,
  GetCart,
} from "../../Controllers/User/CartControllers.js";
import userAuthMiddleware from "../../middleware/User/userAuth.js";

const cardRouter = express.Router();

cardRouter.post("/items/", userAuthMiddleware, AddToCart);
cardRouter.get("/getCart", userAuthMiddleware, GetCart);

export default cardRouter;
