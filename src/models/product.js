import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name must be less than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    productImg: {
      type: String,
      required: true,
      default:
        "https://crowdfundline.com/testing/crowdfund/assets/images/empty.png",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
