import { Request, Response, NextFunction } from "express";

import { USER_ROLES } from "../roles";
import { AuthRequest } from "../types/auth";


export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {

    if (req.user?.role !== USER_ROLES.ADMIN) {
        res.status(403).json({ message: "Forbidden: Only admins can access users" });
        return;
    }
}