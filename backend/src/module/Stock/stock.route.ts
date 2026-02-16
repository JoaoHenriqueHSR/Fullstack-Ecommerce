import express from "express";
import {
    createStock,
    readStocks,
    readStock,
    updateStock,
    deleteStock,
    applyDiscount,
    removeDiscount,
} from "./stock.controller";
import { authStore } from "../../middleware/auth.middleware";

const stockRouter = express.Router({ mergeParams: true });
//misturar parametros, esta juntando os parametros de loja com estoque para criar relação

stockRouter.post("/", authStore, createStock);
stockRouter.get("/", authStore, readStocks);
stockRouter.get("/:stockId", authStore, readStock);
stockRouter.put("/:stockId", authStore, updateStock);
stockRouter.delete("/:stockId", authStore, deleteStock);

stockRouter.patch("/:stockId/discount", authStore, applyDiscount);
stockRouter.patch("/:stockId/remove-discount", authStore, removeDiscount);

export default stockRouter;