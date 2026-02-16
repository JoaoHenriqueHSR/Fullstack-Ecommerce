import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Store from "../store.model";
import "dotenv/config";
import { Request, Response } from "express";

export const loginStore = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const store = await Store.findOne({ email });

    if (!store) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, store.password);

    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }

    const token = Jwt.sign(
        { storeId: store._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" } //tempo que ira expirar ate ser realizado um novo login
    );

    res.json({ token, storeId: store._id });
};
