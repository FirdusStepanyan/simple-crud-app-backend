import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppDataSource from "../database";
import User from "../models/user.model";
import { JWTPayloadType } from "../types/JWTPayloadType";


export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }
 
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as JWTPayloadType;

    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Authorization" });
      return;

    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: Number(decoded.id) },
    });

    if (!user) {
      res.status(401).json({ message: "Authorization" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};