import { Request } from "express";
import { User } from "../models/user.model"; // adjust the path

export interface AuthRequest extends Request {
    user: User; // or `User` if you want the full object
}