import { Request, Response } from "express";
import AppDataSource from "../database";
import Product from "../models/product.model";
import User from "../models/user.model";
import { USER_ROLES } from "../roles";
import { sendResponse } from "../utils/response";

interface AuthRequest extends Request {
    user?: any;
}

class ProductService {
    async getProducts(req: AuthRequest, res: Response): Promise<void> {
        try {
            const productRepository = AppDataSource.getRepository(Product);

            if (!req.user?.id || !req.user?.role) {
                sendResponse(res, null, "Unauthorized", 401);
                return;
            }

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 3;
            const skip = (page - 1) * limit;
            const orderParam = (req.query.order as string)?.toUpperCase() || "ASC";
            const orderDirection = orderParam === "DESC" ? "DESC" : "ASC";

            let whereCondition = {};
            if (req.user.role !== USER_ROLES.ADMIN) {
                whereCondition = { user: { id: req.user.id } };
            }

            const [products, total] = await productRepository.findAndCount({
                where: whereCondition,
                relations: ["user"],
                order: { id: orderDirection },
                skip,
                take: limit,
            });

            const totalPages = Math.ceil(total / limit);

            sendResponse(res, { page, totalPages, totalItems: total, itemsPerPage: limit, products });
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async getProductById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            const { id } = req.params;

            const product = await productRepository.findOne({
                where: { id: Number(id), user: { id: req.user.id } },
                relations: ["user"],
            });

            if (!product) {
                sendResponse(res, null, "Product not found", 404);
                return;
            }

            sendResponse(res, product);
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async createProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { name, quantity, price } = req.body;
            const userId = req.user?.id;

            if (!name || !quantity || !price || !userId) {
                sendResponse(res, null, "All fields are required", 400);
                return;
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                sendResponse(res, null, "User not found", 404);
                return;
            }

            const productRepository = AppDataSource.getRepository(Product);
            const newProduct = productRepository.create({ name, quantity, price, user });
            await productRepository.save(newProduct);

            sendResponse(res, newProduct, "Product created successfully", 201);
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async updateProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, quantity, price } = req.body;
            const productRepository = AppDataSource.getRepository(Product);

            const product = await productRepository.findOne({
                where: { id: Number(id), user: { id: req.user.id } },
                relations: ["user"],
            });

            if (!product) {
                sendResponse(res, null, "Product not found", 404);
                return;
            }

            product.name = name ?? product.name;
            product.quantity = quantity ?? product.quantity;
            product.price = price ?? product.price;

            const updatedProduct = await productRepository.save(product);
            sendResponse(res, updatedProduct, "Product updated successfully");
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const productRepository = AppDataSource.getRepository(Product);

            const product = await productRepository.findOne({
                where: { id: Number(id), user: { id: req.user.id } },
            });

            if (!product) {
                sendResponse(res, null, "Product not found", 404);
                return;
            }

            await productRepository.remove(product);
            sendResponse(res, null, "Product deleted successfully");
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
}

export default new ProductService()