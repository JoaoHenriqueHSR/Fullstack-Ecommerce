import mongoose, { Schema, Types } from "mongoose";

export interface StockDocument extends mongoose.Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  originalPrice: number;
  isDiscountActive: boolean;
  storeId: Types.ObjectId;
  createdAt: Date;
}

const stockSchema = new Schema<StockDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  isDiscountActive: { type: Boolean, default: false },
  storeId: { type: Types.ObjectId, ref: "Store", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<StockDocument>("Stock", stockSchema);
