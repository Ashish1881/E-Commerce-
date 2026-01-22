import express from "express";
import productControllers, {
  AddProduct,
  UpdateProduct,
  DeleteProduct,
} from "../../Controllers/Admin/ProductControllers.js";
import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/product/add", adminAuthMiddleware, AddProduct);
productRouter.put(
  "/product/update/:productId",
  adminAuthMiddleware,
  UpdateProduct,
);
productRouter.delete(
  "/product/delete/:productId",
  adminAuthMiddleware,
  DeleteProduct,
);

export default productRouter;
