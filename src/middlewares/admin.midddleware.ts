import { Request, Response, NextFunction } from "express";

import { USER_ROLES } from "../helpers/enums/roles";
import { AuthRequest } from "../types/auth";


export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log("Admin check user:", req.user);
    if (req.user?.role !== USER_ROLES.ADMIN) {
        res.status(403).json({ message: "Forbidden: Only admins can access users" });
        return;
    }
    next();
}
