import { Request, Response } from "express";
import { StockService } from "./stock.service";

const stockService = new StockService();

export const createStock = async (req: Request, res: Response) => {
    stockService.setRequest(req);
    const stock = await stockService.create({ ...req.body });
    res.status(201).json(stock);
};

export const readStock = async (req: Request, res: Response) => {
    const { storeId, stockId } = req.params;
    const stock = await stockService.findById(stockId);
    res.status(200).json(stock);
};

export const readStocks = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const stocks = await stockService.find({ storeId });
    res.status(200).json(stocks);
};

export const updateStock = async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const updatedStock = await stockService.update(stockId, req.body);
    res.status(200).json(updatedStock);
};

export const deleteStock = async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const deletedStock = await stockService.delete(stockId);
    res.status(200).json(deletedStock);
};

export const applyDiscount = async (req: Request, res: Response) => {
    const { stockId, storeId } = req.params;
    const stock = await stockService.discount(storeId, stockId, req.body);
    res.status(200).json(stock);
};

export const removeDiscount = async (req: Request, res: Response) => {
    const { stockId, storeId } = req.params;
    const stock = await stockService.removeDiscount(stockId, storeId);
    res.status(200).json(stock);
};
