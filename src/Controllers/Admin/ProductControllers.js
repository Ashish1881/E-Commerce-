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

export const DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const isdeleted = await Product.findByIdAndDelete(productId);

    if (!isdeleted) {
      return res.status(404).json({ message: "Product is not found" });
    }
    res.json({ message: "Product Deleted Successfuly" });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const AllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryObj = {};

    if (req.query.name) {
      queryObj.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.price) {
      const priceParam = req.query.price.toString();

      if (priceParam.includes("=")) {
        const [operator, value] = priceParam.split("=");

        const operatorMap = {
          gt: "$gt", // Greater than
          gte: "$gte", // Greater than equal
          lt: "$lt", // Less than
          lte: "$lte", // Less than equal (Jiski aapko zarurat hai)
        };

        if (operatorMap[operator]) {
          queryObj.price = { [operatorMap[operator]]: Number(value) };
        }
      } else {
        queryObj.price = Number(priceParam);
      }
    }

    const products = await Product.find(queryObj)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.json({ message: "Product is not available" });
    }

    const totalProducts = await Product.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: products,
    });
  } catch (error) {
    console.error("Error in AllProduct:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const productControllers = {
  AddProduct,
  UpdateProduct,
  DeleteProduct,
  AllProduct,
};

export default productControllers;
