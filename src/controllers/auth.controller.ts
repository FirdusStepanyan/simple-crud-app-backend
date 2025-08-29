import { Request, Response } from "express";
import AppDataSource from "../database";
import UserSchema, { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWTPayloadType } from "../types/JWTPayloadType";
import { AuthRequest } from "../types/auth";
import { sendVerificationEmail } from "./notification.controller";

export const registration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, lastname, age, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(UserSchema);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(1000 + Math.random() * 9000); // 4 digit code

    const user = userRepository.create({
      name,
      lastname,
      age,
      email,
      password: hashedPassword,
      email_verifi_code: verificationCode,
      is_verified: false,
    });

    const result = await userRepository.save(user);

    const { password: _, email_verifi_code, ...userWithoutPassword } = result;

    await sendVerificationEmail(email, verificationCode);
    
    res.status(201).json({
      message: "User registered. Please verify your email.",
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(UserSchema);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const payload: JWTPayloadType = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, lastname: user.lastname },
      token,
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const emailverifi = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const userRepository = AppDataSource.getRepository(UserSchema);
    const user: any = req?.user;
    console.log(user.email_verifi_code);
    console.log(Number(code));

    if (user.email_verifi_code !== Number(code)) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    user.is_verified = true;
    user.email_verifi_code = null;
    await userRepository.save(user);

    res.json({ message: "Email successfully verified" });
  } catch (error: unknown) {
    console.error("verifi Error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "verification failed",
    });
  }
};