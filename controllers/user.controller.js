const Product = require("../models/user.model.js");
const con = require("../database");

const getUsers = async (req, res) => {
    try {
        const insertQuery = 'SELECT * FROM public.user';
        const users = await con.query(insertQuery);
        res.status(200).json(users.rows);
    } catch (error) {
        res.status(500).json({ message: error, message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const insertQuery = 'SELECT * FROM public.user WHERE id = $1';
        const user = await con.query(insertQuery,[id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const createUser = async (req, res) => {
    try {
        const {name, lastname, age  } = req.body;
        const insertQuery = 'INSERT INTO public.user ( name, lastname, age) VALUES ($1, $2, $3) RETURNING *';
        const result = await con.query(insertQuery, [name, lastname, age]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastname, age } = req.body; 

        const checkQuery = 'SELECT * FROM public.user WHERE id = $1';
        const checkResult = await con.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateQuery = 
            `UPDATE public.user 
            SET name = $1, lastname = $2, age = $3 
            WHERE id = $4 
            RETURNING *`;

        const result = await con.query(updateQuery, [name, lastname, age, id]);

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const checkQuery = 'SELECT * FROM public.user WHERE id = $1';
        const checkResult = await con.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const deleteQuery = 'DELETE FROM public.user WHERE id = $1 RETURNING *';

        const result = await con.query(deleteQuery, [id]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: `user with id ${id} deleted successfully` });
        } else {
            res.status(400).json({ message: "Failed to delete product" });
        }
    } catch (error) {
        console.error("PostgreSQL Error:", error);
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};