import express from "express";
import productControllers, {
  AddProduct,
} from "../../Controllers/Admin/productControllers.js";
import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/product/add", adminAuthMiddleware, AddProduct);

export default productRouter;
