import { Request, Response } from "express";
import { SaleService } from "./sale.service";

const saleService = new SaleService();

export const createSale = async (req: Request, res: Response) => {
    const { stockId, storeId } = req.params;
    const sale = await saleService.create(stockId, storeId, req.body);
    res.status(201).json(sale);
};

export const readSale = async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const sales = await saleService.findAllByStock(stockId);
    res.status(200).json(sales);
};

export const readSalesByStore = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const sales = await saleService.findAllByStore(storeId);
    res.status(200).json(sales);
};
