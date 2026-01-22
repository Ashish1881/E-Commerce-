import User from "../../models/user.js";
import { Product } from "../../models/product.js";
import Cart from "../../models/cart.js";

export const AddToCart = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.user._id;

    const itemData = req.body.items ? req.body.items[0] : req.body;
    const { productId, quantity } = itemData;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Not a valid product id" });
    }

    let userCart = await Cart.findOne({ userId: userId });
    if (userCart) {
      let itemsIndex = userCart.items.findIndex(
        (p) => p.productId == productId,
      );
      if (itemsIndex > -1) {
        userCart.items[itemsIndex].quantity += quantity;
      } else {
        userCart.items.push({ productId, quantity });
      }
      await userCart.save();
      return res.json({ message: "Item added Successfully", userCart });
    } else {
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });

      await newCart.save();
      res.json({ message: "Item added Successfully", cart: newCart });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", Error: error.message });
  }
};

export const GetCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "items.productId",
      select: "name price productImg",
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.json({ cart: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const RemoveItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart is not found" });
    }

    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.items[itemIndex];
      if (productItem.quantity > 1) {
        productItem.quantity -= 1;

        await cart.save();
        return res.json({
          message: "Quantity decreased successfully",
          cart: cart,
        });
      } else {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.json({ message: "Item removed from cart", cart });
      }
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server side error", error: error.message });
  }
};

const cartControllers = {
  AddToCart,
  GetCart,
  RemoveItem,
};
export default cartControllers;
