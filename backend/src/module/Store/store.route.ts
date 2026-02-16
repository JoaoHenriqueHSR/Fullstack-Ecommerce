import express from "express";
import {
    createStore,
    readStores,
    readStore,
    updateStore,
    deleteStore,
} from "./store.controller";

const storeRouter = express.Router();

storeRouter.post("/", createStore);
storeRouter.get("/", readStores);
storeRouter.get("/:storeId", readStore);
storeRouter.put("/:storeId", updateStore);
storeRouter.delete("/:storeId", deleteStore);

export default storeRouter;
