import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export const registration = (req: Request, res: Response) => AuthService.registration(req, res);
export const login = (req: Request, res: Response) => AuthService.login(req, res);
export const emailVerify = (req: Request, res: Response) => AuthService.emailVerify(req, res);
