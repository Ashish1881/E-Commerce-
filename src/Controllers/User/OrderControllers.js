import mongoose from "mongoose";
import Order from "../../models/order.js";
import Cart from "../../models/cart.js";
import { Product } from "../../models/product.js";
import Payment from "../../models/payment.js";

export const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id).session(
        session,
      );

      if (!product) {
        throw new Error(`Product not found : ${item.productId._id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock not available for: ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create Order

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: "PENDING_PAYMENT",
    });

    const savedOrder = await newOrder.save({ session });

    //   Cart Empty karo

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully",
      orderId: savedOrder._id,
      status: savedOrder.status,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Checkout ERROR: ", error);
    return res.status(500).json({
      message: "Checkout failed",
      error: error.message,
    });
  }
};

export const paymetStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const allowedStatus = ["SUCCESS", "FAILED"];
    const isAllowedStatus = allowedStatus.includes(status);

    if (!isAllowedStatus) {
      return res.status(400).json({
        message: "Invalid payment status. Only SUCCESS or FAILED allowed",
      });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order is not found" });
    }
    if (order.status === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Cancelled order cannot be paid" });
    }
    if (order.status === "PAID") {
      return res.status(400).json({ message: "Order is already paid" });
    }
    const mockTransactionId = `TXN_${Date.now()}`;

    const payment = new Payment({
      orderId: order._id,
      transactionId: mockTransactionId,
      amount: order.totalAmount,
      status: status,
    });

    await payment.save();

    if (status === "SUCCESS") {
      order.status = "PAID";
      await order.save();
      return res.status(200).json({
        message: "Payment Successful",
        orderId: order._id,
        transactionId: mockTransactionId,
        status: "PAID",
        email:
          "EMAIL JOB: Payment Confirmation Email queued for User" + order._id,
      });
    } else {
      order.status = "PAYMENT_FAILED";
      await order.save();
      return res.status(400).json({
        message: "Payment FAILED",
        orderId: order._id,
        transactionId: mockTransactionId,
        status: "FAILED",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.productId", "name price productImg");

    const totalOrders = await Order.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalOrders: totalOrders,
        limit: limit,
      },
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.json({ message: "Please enter orderId" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ message: "Not order found" });
    }

    res.json({
      data: order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const order = {
  checkout,
  paymetStatus,
  getMyOrders,
  getMyOrder,
};

export default order;
