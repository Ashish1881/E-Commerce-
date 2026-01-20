import adminAuthMiddleware from "../../middleware/Admin/adminAuth.js";

export const AddProduct = async (req, res) => {
  const product = req.body;

  res.send(product);
};

const productControllers = {
  AddProduct,
};

export default productControllers;
