import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      enum: ["SUCCESS", "FAILED"],
    },
  },
  { timestamps },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
