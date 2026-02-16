import express from "express";
import { loginStore } from "./login.controller";

const storeAuthRouter = express.Router();

storeAuthRouter.post("/login", loginStore);

export default storeAuthRouter;
