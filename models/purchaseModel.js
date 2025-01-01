import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  ingredient: [{
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});


const purchaseModel = mongoose.models.purchase || mongoose.model('purchase', purchaseSchema);

export default purchaseModel;