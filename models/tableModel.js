import mongoose from "mongoose";

export const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
});

const tableModel =
  mongoose.models.table || mongoose.model("table", tableSchema);

export default tableModel;
