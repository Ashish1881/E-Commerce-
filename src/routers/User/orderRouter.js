import express from "express";
import userAuthMiddleware from "../../middleware/User/userAuth.js";
import order, {
  checkout,
  paymetStatus,
} from "../../Controllers/User/OrderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/checkout", userAuthMiddleware, checkout);
orderRouter.post("/:orderId/pay", userAuthMiddleware, paymetStatus);
export default orderRouter;
