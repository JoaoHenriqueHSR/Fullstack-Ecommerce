import "dotenv/config";
import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
};
