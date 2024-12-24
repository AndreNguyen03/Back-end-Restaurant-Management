import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unitprice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const ingredientModel = mongoose.models.ingredient || mongoose.model('ingredient', ingredientSchema);

export default ingredientModel;