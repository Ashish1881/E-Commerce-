import express from "express";
import productControllers, {
  AddProduct,
  UpdateProduct,
} from "../../Controllers/Admin/productControllers.js";
import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/product/add", adminAuthMiddleware, AddProduct);
productRouter.put(
  "/product/update/:productId",
  adminAuthMiddleware,
  UpdateProduct,
);

export default productRouter;
