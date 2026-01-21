import express from "express";
import { AllProduct } from "../../Controllers/Admin/productControllers.js";

const PublicProduct = express.Router();

PublicProduct.get("/products", AllProduct);

export default PublicProduct;
