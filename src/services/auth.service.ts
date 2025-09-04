import { Response, Request } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import { sendResponse } from "../helpers/utils/response";
import { AuthRequest } from "../types/auth";
import { generateToken } from "../helpers/jwt.helper";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper";
import { sendVerificationEmail } from "../controllers/notification.controller";

class AuthService {
    async registration(req: Request, res: Response): Promise<void> {
        try {
            const { name, lastname, age, email, password } = req.body;
            const userRepository = AppDataSource.getRepository(User);

            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                sendResponse(res, null, "Email already registered", 409);
                return;
            }

            const hashedPassword = await hashPassword(password);
            const verificationCode = Math.floor(1000 + Math.random() * 9000);

            const user = userRepository.create({
                name, lastname, age, email,
                password: hashedPassword,
                email_verifi_code: verificationCode,
                is_verified: false,
            });

            const result = await userRepository.save(user);
            const { password: _, email_verifi_code, ...userSafe } = result;

            await sendVerificationEmail(email, verificationCode);

            sendResponse(res, userSafe, "User registered. Please verify your email.", 201);
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const userRepository = AppDataSource.getRepository(User);

            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                sendResponse(res, null, "Invalid email or password", 401);
                return;
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                sendResponse(res, null, "Invalid email or password", 401);
                return;
            }

            const token = generateToken({ id: user.id, email: user.email });

            sendResponse(res, { id: user.id, name: user.name, lastname: user.lastname, token }, "Login successful");
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }

    async emailVerify(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { code } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const user = req.user as any;

            if (user.email_verifi_code !== Number(code)) {
                sendResponse(res, null, "Invalid verification code", 400);
                return;
            }

            user.is_verified = true;
            user.email_verifi_code = null;
            await userRepository.save(user);

            sendResponse(res, null, "Email successfully verified");
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Verification failed", 500);
        }
    }
}

export default new AuthService();