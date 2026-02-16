import mongoose, { Schema, Types } from "mongoose";

export interface SaleDocument extends mongoose.Document {
    stockId: Types.ObjectId;
    storeId: Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
}

const saleSchema = new Schema<SaleDocument>({
    stockId: { type: Types.ObjectId, ref: "Stock", required: true },
    storeId: { type: Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<SaleDocument>("Sale", saleSchema);
