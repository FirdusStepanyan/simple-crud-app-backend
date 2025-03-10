import AppDataSource from "../database.js";

import Product from "../models/product.model.js";
import User from "../models/user.model.js";


export const getProducts = async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const productRepository = AppDataSource.getRepository(Product);
        const products = await productRepository.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;

        const product = await productRepository.findOneBy({ id: Number(id) });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, quantity, price, userId } = req.body;

        if (!name || !quantity || !price || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const productRepository = AppDataSource.getRepository(Product);
        const newProduct = productRepository.create({
            name,
            quantity,
            price,
            user,
        });

        await productRepository.save(newProduct);
        return res.status(201).json({
            id: newProduct.id,
            name: newProduct.name,
            quantity: newProduct.quantity,
            price: newProduct.price,
            userId: user.id,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;
        const { name, quantity, price, userId} = req.body;

        const product = await productRepository.findOneBy({ id: Number(id) });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name;
        product.quantity = quantity;
        product.price = price;
        product.userId = userId;

        const updateProduct = await productRepository.save(product);

        res.status(200).json(updateProduct);
    } catch (error) {
        console.error("TypeORM Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const productRepository = AppDataSource.getRepository(Product);
        const { id } = req.params;
        const product = await productRepository.findOneBy({ id: Number(id) });

        if (!product) {
            return res.status(404).json({ message: "User not found" });
        }

        await productRepository.delete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("TypeORM Error:", error);
        res.status(500).json({ message: error.message });
    }
};