import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";
import { Product } from "../../models/product.js";

export const AddProduct = async (req, res) => {
  try {
    const productData = req.body;
    const allowedFields = [
      "name",
      "price",
      "description",
      "stock",
      "productImg",
    ];

    const allowedProduct = Object.keys(req.body).filter(
      (fields) => !allowedFields.includes(fields),
    );

    if (allowedProduct.length > 0) {
      // throw new Error(`This Fields are not allowed `);
      return res.status(400).json({
        message: "These fields are not allowed " + allowedProduct,
      });
    }

    console.log(productData);

    const product = new Product(productData);

    await product.save();

    return res.send("add successfuly");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const productControllers = {
  AddProduct,
};

export default productControllers;
