import { Request, Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";

// Get all users (with products relation)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: ["products"],
    });
    
    res.status(200).json(users);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Get single user by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({
      where: { id: Number(id) },
      relations: ["products"],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};


// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { name, lastname, age, email} = req.body;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!email) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.name = name;
    user.lastname = lastname;
    user.age = age;
    user.email=email;

    const updatedUser = await userRepository.save(user);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;

    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await userRepository.delete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};
