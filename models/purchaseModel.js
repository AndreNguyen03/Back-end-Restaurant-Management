import mongoose from 'mongoose';

const purchaseDetailSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredient',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const purchaseSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  details: [purchaseDetailSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
});

const purchaseModel = mongoose.models.purchase || mongoose.model('purchase', purchaseSchema);

export default purchaseModel;
