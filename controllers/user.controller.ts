// import User from "../models/user.model.js";
// import AppDataSource from "../database.js";

// export const getUsers = async (req, res) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }
//         const userRepository = AppDataSource.getRepository(User);
//         const users = await userRepository.find({
//             relations: ["products"], 
//         });

//         res.status(200).json(users);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getUser = async (req, res) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const userRepository = AppDataSource.getRepository(User);
//         const { id } = req.params;

//         const user = await userRepository.findOneBy({ id: Number(id) });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         console.log("Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// export const createUser = async (req, res) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }
//         const { id, name, lastname, age } = req.body;
//         const userRepository = AppDataSource.getRepository(User);
//         const user = userRepository.create({ id, name, lastname, age });
//         const result = await userRepository.save(user);

//         res.status(201).json(result);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateUser = async (req, res) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const userRepository = AppDataSource.getRepository(User);
//         const { id } = req.params;
//         const { name, lastname, age } = req.body;

//         const user = await userRepository.findOneBy({ id: Number(id) });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         user.name = name;
//         user.lastname = lastname;
//         user.age = age;

//         const updateUser = await userRepository.save(user);

//         res.status(200).json(updateUser);
//     } catch (error) {
//         console.error("TypeORM Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// export const deleteUser = async (req, res) => {
//     try {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }

//         const userRepository = AppDataSource.getRepository(User);
//         const { id } = req.params;
//         const user = await userRepository.findOneBy({ id: Number(id) });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         await userRepository.delete(id);

//         res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.error("TypeORM Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };


import { Request, Response } from "express";
import User from "../models/user.model";
import AppDataSource from "../database";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            relations: ["products"], 
        });
        res.status(200).json(users);
    } catch (error: unknown) {
        console.error("Error:", error);
    
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;

        const user = await userRepository.findOneBy({ id: Number(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error: unknown) {
        console.error("Error:", error);
    
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const { id, name, lastname, age } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = userRepository.create({ id, name, lastname, age });
        const result = await userRepository.save(user);

        res.status(201).json(result);
    } catch (error: unknown) {
        console.error("Error:", error);
    
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        const { name, lastname, age } = req.body;

        const user = await userRepository.findOneBy({ id: Number(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.name = name;
        user.lastname = lastname;
        user.age = age;

        const updatedUser = await userRepository.save(user);
        res.status(200).json(updatedUser);
    } catch (error: unknown) {
        console.error("Error:", error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        const user = await userRepository.findOneBy({ id: Number(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        await userRepository.delete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: unknown) {
        console.error("Error:", error);
    
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};