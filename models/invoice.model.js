"use strict";

import  {model, Schema} from 'mongoose';

const DOCUMENT_NAME = 'Invoice';
const COLLECTION_NAME = 'invoice';

const invoiceSchema = new  Schema({
    customId: { 
    type: String,
    unique: true,
    required: true, 
  },
  table: {
    type: String,
    default: 'none'
  },
  total: {
    type: Number,
    required: true 
  },
  items: [
    {
      dish: { type: Schema.Types.ObjectId, ref: 'dishModel', required: true }, // Tham chiếu đến model Dish
      name: { type: String, required: true }, // Thêm trường name
      price: { type: Number, required: true }, // Thêm trường price
      quantity: { type: Number, required: true }, // Số lượng món ăn
      totalPrice: { type: Number, required: true }, // Tổng giá của món ăn (price * quantity)
    },
  ],
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

export const invoice = model(DOCUMENT_NAME, invoiceSchema);