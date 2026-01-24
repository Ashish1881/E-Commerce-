import express from "express";
import userAuthMiddleware from "../../middleware/User/userAuth.js";
import order, {
  checkout,
  paymetStatus,
  getMyOrders,
  getMyOrder,
} from "../../Controllers/User/OrderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/checkout", userAuthMiddleware, checkout);
orderRouter.post("/:orderId/pay", userAuthMiddleware, paymetStatus);
orderRouter.get("/orders", userAuthMiddleware, getMyOrders);
orderRouter.get("/orders/:orderId", userAuthMiddleware, getMyOrder);
export default orderRouter;
