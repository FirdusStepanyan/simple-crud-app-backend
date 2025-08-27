import { Request, Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserSchema from "../models/user.model";
import { JWTPayloadType } from "../types/JWTPayloadType";

// User registration
export const registration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, lastname, age, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    // Check if email already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepository.create({
      name,
      lastname,
      age,
      email,
      password: hashedPassword,
    });

    const result = await userRepository.save(user);

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = result;

    res.status(201).json(userWithoutPassword);
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};


// Create user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(UserSchema);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    let payload: JWTPayloadType = { id: user.id, email: user.email };
    // generate JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "supersecret", // use env var in prod
      { expiresIn: "1h" }
    );

    // ✅ return only name + lastname + token
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
      },
      token,
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};
