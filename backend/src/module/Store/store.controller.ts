import { Request, Response } from "express";
import { StoreService } from "./store.service";

const storeService = new StoreService();

export const createStore = async (req: Request, res: Response) => {
    const store = await storeService.create(req.body);
    res.status(201).json(store);
}

export const readStores = async (req: Request, res: Response) => {
    const stores = await storeService.find();
    res.status(200).json(stores);
}

export const readStore = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const store = await storeService.findById(storeId);
    res.status(200).json(store);
}

export const updateStore = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const updatedStore = await storeService.update(storeId, req.body);
    res.status(200).json(updatedStore);
}

export const deleteStore = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const deletedStore = await storeService.delete(storeId);
    res.status(200).json(deletedStore);
}
