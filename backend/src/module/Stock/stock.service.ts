import Stock from "./stock.model";
import { CreateStockDTO } from "./dto/create-stock.dto";
import { FindStockByStoreDTO } from "./dto/find-stock-store.dto";
import { UpdateStockDTO } from "./dto/update-stock.dto";
import { StockDiscountDTO } from "./dto/desconto-stock";
import { Error, Types } from "mongoose";
import { Request } from "express";

export class StockService {

  public req?: Request;

  public setRequest(req: Request) {
    this.req = req;
  }

  public async create(data: CreateStockDTO) {
    const { storeId } = this.req?.params as any;

    if (data.quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    if (data.price < 0) {
      throw new Error("Price cannot be negative");
    }

    data.originalPrice = data.price;

    const stock = await Stock.create({
      ...data,
      storeId: new Types.ObjectId(storeId)
    });

    return stock;
  }

  public async find(data: FindStockByStoreDTO) {
    const stock = await Stock.find({
      storeId: new Types.ObjectId(data.storeId)
    });

    return stock;
  }

  public async findById(stockId: string) {
    return await Stock.findById({ _id: new Types.ObjectId(stockId) });
  }

  public async update(stockId: string, data: UpdateStockDTO) {

    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error("Invalid name");
    }

    if (data.quantity !== undefined && data.quantity < 0) {
      throw new Error("Invalid quantity");
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error("Invalid price");
    }

    if (data.price !== undefined) {
      data.originalPrice = data.price;
      data.isDiscountActive = false;
    }

    const stock = await Stock.findByIdAndUpdate(stockId, data, { new: true });

    if (!stock) {
      throw new Error("Stock not found");
    }

    return stock;
  }

  public async delete(stockId: string) {
    return await Stock.findByIdAndDelete(stockId);
  }

  public async discount(
    storeId: string,
    stockId: string,
    data: StockDiscountDTO
  ) {
    const stock = await Stock.findOne({ _id: stockId, storeId });

    if (!stock) {
      throw new Error("No stock found for this store");
    }

    if (stock.isDiscountActive) {
      throw new Error("Discount already applied");
    }

    stock.originalPrice = stock.price;
    stock.price = stock.price * (1 - data.percentage / 100);
    stock.isDiscountActive = true;

    await stock.save();
    return stock;
  }

  public async removeDiscount(stockId: string, storeId: string) {
    const stock = await Stock.findOne({ _id: stockId, storeId });

    if (!stock) {
      throw new Error("No stock found for this store");
    }

    if (!stock.isDiscountActive) {
      throw new Error("No active discount for this stock");
    }

    stock.price = stock.originalPrice;
    stock.isDiscountActive = false;

    await stock.save();
    return stock;
  }
}
