const Product = require("../models/product.model.js");
const con = require("../database");

const getProducts = async (req, res) => {
    try {
        const insertQuery = 'SELECT * FROM public.product';
        const products = await con.query(insertQuery);
        res.status(200).json(products.rows);
    } catch (error) {
        res.status(500).json({ message: error, message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const insertQuery = 'SELECT * FROM public.product WHERE id = $1';
        const product = await con.query(insertQuery,[id]);
        res.status(200).json(product.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const createProduct = async (req, res) => {
    try {
        const {name, quantity, price } = req.body;
        const insertQuery = 'INSERT INTO product ( name, quantity, price) VALUES ($1, $2, $3) RETURNING *';
        const result = await con.query(insertQuery, [name, quantity, price]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price } = req.body; 

        const checkQuery = 'SELECT * FROM public.product WHERE id = $1';
        const checkResult = await con.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updateQuery = 
            `UPDATE public.product 
            SET name = $1, quantity = $2, price = $3 
            WHERE id = $4 
            RETURNING *`;

        const result = await con.query(updateQuery, [name, quantity, price, id]);

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const checkQuery = 'SELECT * FROM public.product WHERE id = $1';
        const checkResult = await con.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const deleteQuery = 'DELETE FROM public.product WHERE id = $1 RETURNING *';

        const result = await con.query(deleteQuery, [id]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: `Product with id ${id} deleted successfully` });
        } else {
            res.status(400).json({ message: "Failed to delete product" });
        }
    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};