import express from "express";
import cartControllers, {
  AddToCart,
  GetCart,
  RemoveItem,
} from "../../Controllers/User/CartControllers.js";
import userAuthMiddleware from "../../middleware/User/userAuth.js";

const cardRouter = express.Router();

cardRouter.get("/getCart", userAuthMiddleware, GetCart);
cardRouter.post("/items/", userAuthMiddleware, AddToCart);
cardRouter.delete("/item/:productId", userAuthMiddleware, RemoveItem);

export default cardRouter;
