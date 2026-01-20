import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";
import { Product } from "../../models/product.js";
import valideFields from "../../Utils/valideFields.js";

export const AddProduct = async (req, res) => {
  try {
    valideFields(req);
    const productData = req.body;

    const product = new Product(productData);

    await product.save();

    return res.send("add successfuly");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    valideFields(req);

    const productId = req.params.productId;
    const updateFileds = req.body;

    const product = await Product.findByIdAndUpdate(productId, updateFileds, {
      returnDocument: "after",
    });

    if (!product) {
      return res.status(400).json({ message: "Product is not found" });
    }

    res.json({ message: "Fileds update Successfuly", product });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const productControllers = {
  AddProduct,
  UpdateProduct,
};

export default productControllers;
