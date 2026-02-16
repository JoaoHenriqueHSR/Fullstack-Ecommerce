import express from "express";
import { createSale, readSale } from "./sale.controller";
import { authStore } from "../../middleware/auth.middleware";

const saleRouter = express.Router({ mergeParams: true });

saleRouter.post("/", authStore, createSale);
saleRouter.get("/", authStore, readSale);

export default saleRouter;
