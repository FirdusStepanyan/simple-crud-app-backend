import { AuthRequest } from "../types/auth";
import { Response } from "express";
import ProductService from "../services/product.service";

export const getProducts = (req: AuthRequest, res: Response) => ProductService.getProducts(req, res);
export const getProduct = (req: AuthRequest, res: Response) => ProductService.getProductById(req, res);
export const createProduct = (req: AuthRequest, res: Response) => ProductService.createProduct(req, res);
export const updateProduct = (req: AuthRequest, res: Response) => ProductService.updateProduct(req, res);
export const deleteProduct = (req: AuthRequest, res: Response) => ProductService.deleteProduct(req, res);