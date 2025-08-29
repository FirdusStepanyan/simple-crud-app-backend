import { Request, Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth";
import { sendVerificationEmail } from "./notification.controller";


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
      relations: ["products"],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, email_verifi_code, ...userWithoutSensitive } = user;

    res.status(200).json(userWithoutSensitive);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { name, lastname, age, email } = req.body;

    const user = req.user as any;

    let email_updated = false;
    let verificationCode
  
    if (email && email !== user.email) {
      verificationCode = Math.floor(1000 + Math.random() * 9000);
      user.email = email;
      user.email_verifi_code = verificationCode;
      user.is_verified = false;

      email_updated = true
      console.log(`Verification code sent to ${email}: ${verificationCode}`);
    }

    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (age) user.age = age;

    const updatedUser = await userRepository.save(user);
    if (email_updated && verificationCode) {
      await sendVerificationEmail(email, verificationCode);
    }
    const { password, email_verifi_code, ...mnacakeyer } = updatedUser;
console.log(mnacakeyer);

    res.status(200).json({ message: "User updated", user: mnacakeyer });
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