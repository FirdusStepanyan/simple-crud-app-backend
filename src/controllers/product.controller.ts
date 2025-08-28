import { Request, Response } from "express";
import AppDataSource from "../database";
import Product from "../models/product.model";
import User from "../models/user.model";
import { USER_ROLES } from "../roles";

interface AuthRequest extends Request {
    user?: any
}

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productRepository = AppDataSource.getRepository(Product);

    if (!req.user?.id || !req.user?.role) {
      res.status(401).json({ message: "Unauthorized" });
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

    res.status(200).json({
      page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      products,
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const getProduct = async (req: any, res: Response): Promise<void> => {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;

        const product = await productRepository.findOne({
            where: {
                id: Number(id),
                user: {
                    id: req.user.id
                }
            },
            relations: ["user"],
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error: unknown) {
        console.error("Error:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, quantity, price } = req.body; // only from body
        const userId = req.user?.id; // from authenticated user

        if (!name || !quantity || !price || !userId) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const productRepository = AppDataSource.getRepository(Product);
        const newProduct = productRepository.create({
            name,
            quantity,
            price,
            user,
        });

        await productRepository.save(newProduct);

        res.status(201).json(newProduct);
    } catch (error: unknown) {
        console.error("Error:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;
        const { name, quantity, price } = req.body;

        const product = await productRepository.findOne({
            where: {
                id: Number(id),

                user: {
                    id: req.user.id

                }

            },
            relations: ["user"],

        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        product.name = name ?? product.name;
        product.quantity = quantity ?? product.quantity;
        product.price = price ?? product.price;

        const updatedProduct = await productRepository.save(product);

        res.status(200).json(updatedProduct);
    } catch (error: unknown) {
        console.error("Error:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;

        const product = await productRepository.findOne({
            where: {
                id: Number(id),
                user: {
                    id: req.user.id
                }
            }
        });
        console.log(req.user.id);

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }


        await productRepository.remove(product);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: unknown) {
        console.error("Error:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};