import Sale from "./sale.model";
import Stock from "../Stock/stock.model";
import { CreateSaleDTO } from "./dto/create-sale.dto";
import { Types, Error } from "mongoose";

export class SaleService {

    public async create(stockId: string, storeId: string, data: CreateSaleDTO) {
        if (data.quantity <= 0) {
            throw new Error("Invalid quantity");
        }

        const stock = await Stock.findOneAndUpdate(
            {
                _id: stockId,
                storeId,
                quantity: { $gte: data.quantity }
            },
            {
                $inc: { quantity: -data.quantity }
            },
            {
                new: true
            }
        );

        if (!stock) {
            throw new Error("Insufficient stock or stock not found");
        }

        const unitPrice = stock.price;
        const totalPrice = unitPrice * data.quantity;

        const sale = await Sale.create({
            stockId: stock._id,
            storeId: stock.storeId,
            name: stock.name,
            quantity: data.quantity,
            unitPrice,
            totalPrice
        });

        return sale;
    }

    public async findAllByStock(stockId: string) {
        const sale = await Sale.find({ stockId: new Types.ObjectId(stockId) });
        return sale;
    }

    public async findAllByStore(storeId: string) {
        const sales = await Sale.find({ storeId: new Types.ObjectId(storeId) }).sort({ createdAt: -1 });

        return sales;
    }
}
