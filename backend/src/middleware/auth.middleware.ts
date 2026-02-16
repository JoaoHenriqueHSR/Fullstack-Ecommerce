import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  storeId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    storeId?: string;
  }
}

export const authStore = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");// Usando destructuring para ignorar o primeiro elemento (Bearer) e pegar apenas o segundo (o token JWT) É equivalente a: const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    req.storeId = decoded.storeId;

    if (req.storeId !== req.params.storeId) {
      return res
        .status(403)
        .json({ message: "You cannot access data from another store" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
