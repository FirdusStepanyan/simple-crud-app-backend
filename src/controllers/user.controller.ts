import { AuthRequest } from "../types/auth";
import { Response } from "express";
import UserService from "../services/user.service";

export const getUsers = (req: AuthRequest, res: Response) => UserService.getUsers(req, res);
export const getUser = (req: AuthRequest, res: Response) => UserService.getUser(req, res);
export const getProfile = (req: AuthRequest, res: Response) => UserService.getProfile(req, res);
export const updateProfile = (req: AuthRequest, res: Response) => UserService.updateProfile(req, res);
export const updatePassword = (req: AuthRequest, res: Response) => UserService.updatePassword(req, res);
export const uplaodProfileImage = (req: any, res: any) => UserService.uplaodProfileImage(req, res);
export const deleteUser = (req: AuthRequest, res: Response) => UserService.deleteUser(req, res);