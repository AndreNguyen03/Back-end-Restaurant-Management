import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  exactAddress: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  items:{
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "confirmed",
  },    
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;