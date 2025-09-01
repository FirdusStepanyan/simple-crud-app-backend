import { Response } from "express";
import AppDataSource from "../database";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/response";
import { AuthRequest } from "../types/auth";
import { sendVerificationEmail } from "../controllers/notification.controller";


class UserService {
    async getUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id || !req.user?.role) {
                sendResponse(res, null, "Unauthorized", 401);
                return;
            }

            const userRepository = AppDataSource.getRepository(User);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 3;
            const skip = (page - 1) * limit;

            const [users, total] = await userRepository.findAndCount({ relations: ["products"], skip, take: limit });
            const totalPages = Math.ceil(total / limit);

            sendResponse(res, { page, totalPages, totalItems: total, itemsPerPage: limit, users });
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async getUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const { id } = req.params;
            const user = await userRepository.findOne({ where: { id: Number(id) }, relations: ["products"] });

            if (!user) {
                sendResponse(res, null, "User not found", 404);
                return;
            }

            sendResponse(res, user);
        } catch (error: unknown) {
            console.error(error);
            sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
        }
    }
    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
        if (!req.user) {
            sendResponse(res, null, "Unauthorized", 401);
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id }, relations: ["products"] });

        if (!user) {
            sendResponse(res, null, "User not found", 404);
            return;
        }

        const { password, email_verifi_code, ...userWithoutSensitive } = user;
        sendResponse(res, userWithoutSensitive);
    } catch (error: unknown) {
        console.error(error);
        sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
    }
    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
        const userRepository = AppDataSource.getRepository(User);
        const { name, lastname, age, email } = req.body;

        const user = req.user as any;
        let email_updated = false;
        let verificationCode;

        if (email && email !== user.email) {
            verificationCode = Math.floor(1000 + Math.random() * 9000);
            user.email = email;
            user.email_verifi_code = verificationCode;
            user.is_verified = false;
            email_updated = true;
            console.log(`Verification code sent to ${email}: ${verificationCode}`);
        }

        if (name) user.name = name;
        if (lastname) user.lastname = lastname;
        if (age) user.age = age;

        const updatedUser = await userRepository.save(user);
        if (email_updated && verificationCode) await sendVerificationEmail(email, verificationCode);

        const { password, email_verifi_code, ...userSafe } = updatedUser;
        sendResponse(res, userSafe, "User updated successfully");
    } catch (error: unknown) {
        console.error(error);
        sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
    }
    async updatePassword(req: AuthRequest, res: Response): Promise<void> {
         try {
        const userRepository = AppDataSource.getRepository(User);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!req.user) {
            sendResponse(res, null, "Unauthorized", 401);
            return;
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            sendResponse(res, null, "All fields are required", 400);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            sendResponse(res, null, "New passwords do not match", 400);
            return;
        }

        const user = await userRepository.findOneBy({ id: req.user.id });
        if (!user) {
            sendResponse(res, null, "User not found", 404);
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            sendResponse(res, null, "Current password is incorrect", 400);
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await userRepository.save(user);

        sendResponse(res, null, "Password updated successfully");
    } catch (error: unknown) {
        console.error(error);
        sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
    }
    async deleteUser(req: AuthRequest, res: Response): Promise<void> {
        try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;

        const user = await userRepository.findOneBy({ id: Number(id) });
        if (!user) {
            sendResponse(res, null, "User not found", 404);
            return
        }

        await userRepository.delete(id);
        sendResponse(res, null, "User deleted successfully");
    } catch (error: unknown) {
        console.error(error);
        sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
    }
}

export default new UserService()