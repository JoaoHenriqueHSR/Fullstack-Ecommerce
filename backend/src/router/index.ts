import express from "express";
import storeRouter from "../module/Store/store.route";
import stockRouter from "../module/Stock/stock.route";
import authStoreRouter from "../module/Store/auth/login.routes";
import saleRouter from "../module/Sale/sale.route";

const router = express.Router();

router.use("/store", storeRouter);

router.use("/store/:storeId/stock", stockRouter);

router.use("/store/:storeId/stock/:stockId/sale", saleRouter);

router.use("/auth", authStoreRouter);

import { readSalesByStore } from "../module/Sale/sale.controller";
import { authStore } from "../middleware/auth.middleware";

router.get("/store/:storeId/sales", authStore, readSalesByStore);

export default router;