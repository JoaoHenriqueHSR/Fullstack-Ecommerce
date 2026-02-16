import mongoose from "mongoose";

export interface StoreDocument extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    postalCode: string,
    cnpj: string,
    createAt: Date
};

const storeSchema = new mongoose.Schema<StoreDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    postalCode: { type: String, required: true },
    cnpj: { type: String, required: true },
    createAt: { type: Date, default: Date.now }
});

export default mongoose.model<StoreDocument>("Store", storeSchema);
