import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth";

export const requireVerifiedEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.is_verified) {
      res.status(403).json({ message: "Email not verified. Please verify your email first." });
      return;
    }

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};