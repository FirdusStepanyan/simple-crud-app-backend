import { Request, Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response";
import { sendVerificationEmail } from "./notification.controller";
import { AuthRequest } from "../types/auth";

export const registration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, lastname, age, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser){
      sendResponse(res, null, "Email already registered", 409);
      return;
    }    

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const user = userRepository.create({
      name, lastname, age, email, password: hashedPassword, email_verifi_code: verificationCode, is_verified: false
    });

    const result = await userRepository.save(user);
    const { password: _, email_verifi_code, ...userSafe } = result;

    await sendVerificationEmail(email, verificationCode);

    sendResponse(res, userSafe, "User registered. Please verify your email.", 201);
  } catch (error: unknown) {
    console.error(error);
    sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      sendResponse(res, null, "Invalid email or password", 401);
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendResponse(res, null, "Invalid email or password", 401);
      return
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });
    sendResponse(res, { id: user.id, name: user.name, lastname: user.lastname, token }, "Login successful");
  } catch (error: unknown) {
    console.error(error);
    sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
  }
};

export const emailverifi = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = req.user as any;

    if (user.email_verifi_code !== Number(code)) {
      sendResponse(res, null, "Invalid verification code", 400);
      return
    }

    user.is_verified = true;
    user.email_verifi_code = null;
    await userRepository.save(user);

    sendResponse(res, null, "Email successfully verified");
  } catch (error: unknown) {
    console.error(error);
    sendResponse(res, null, error instanceof Error ? error.message : "Verification failed", 500);
  }
};
