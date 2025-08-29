import { Request, Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import { USER_ROLES } from "../roles";
import { AuthRequest } from "../types/auth";


export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id || !req.user?.role) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const [users, total] = await userRepository.findAndCount({
      relations: ["products"],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      users,
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};



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

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ["products"], // եթե պետք ա նաև կապված տվյալները
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



export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { name, lastname, age, email } = req.body;

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
    user.email = email;

    const updatedUser = await userRepository.save(user);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};


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
