import express from "express";
import cors from "cors";
import router from "./router/index";

const app = express();

app.use(cors());//deixando os parenteses vazio faz com que qualquer front possa usar 
app.use(express.json());
app.use(router);

export default app; 