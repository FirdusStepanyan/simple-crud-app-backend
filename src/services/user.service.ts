import { AuthRequest } from "../types/auth";
import { Response } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { sendResponse } from "../helpers/utils/response";
import { sendVerificationEmail } from "../controllers/notification.controller";
import { UserRepository } from "../repositories/user.repositori";
import { TimeSlotRepository } from "../repositories/timeSlot.repositori";

class UserService {
  private userRepository = new UserRepository();
  private timeSlotRepository = new TimeSlotRepository();

  async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id || !req.user?.role) {
        sendResponse(res, null, "Unauthorized", 401);
        return;
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAll(skip, limit);
      const totalPages = Math.ceil(total / limit);

      sendResponse(res, { page, totalPages, totalItems: total, itemsPerPage: limit, users });
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(Number(id));
      if (!user) {
        sendResponse(res, null, "User not found", 404);
        return;
      }
      sendResponse(res, user);
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendResponse(res, null, "Unauthorized", 401);
        return;
      }
      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        sendResponse(res, null, "User not found", 404);
        return;
      }
      const { password, email_verifi_code, ...userSafe } = user;
      sendResponse(res, userSafe);
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async getAllAdminTimeSlots(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [slots, total] = await this.timeSlotRepository.findAllWithAdmins(skip, limit);

      const adminsMap: Record<number, any> = {};

      slots.forEach(slot => {
        const admin = slot.user;

        if (!adminsMap[admin.id]) {
          adminsMap[admin.id] = {
            ...admin,
            slots: []
          };
          delete adminsMap[admin.id].password;
          delete adminsMap[admin.id].email_verifi_code;
        }

        const { user, ...slotWithoutUser } = slot;

        adminsMap[admin.id].slots.push(slotWithoutUser);
      });

      sendResponse(res, Object.values(adminsMap), "Success");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
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
      }

      if (name) user.name = name;
      if (lastname) user.lastname = lastname;
      if (age) user.age = age;

      const updatedUser = await this.userRepository.save(user);

      if (email_updated && verificationCode) {
        await sendVerificationEmail(email, verificationCode);
      }

      const { password, email_verifi_code, ...userSafe } = updatedUser;
      sendResponse(res, userSafe, "User updated successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async uploadProfileImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendResponse(res, null, "Unauthorized", 401);
        return;
      }
      if (!req.file) {
        sendResponse(res, null, "No file uploaded", 400);
        return;
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        sendResponse(res, null, "User not found", 404);
        return;
      }

      if (user.image) {
        const relativePath = user.image.replace("http://localhost:3000/", "");
        const oldImagePath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
      }

      const fullUrl = `http://localhost:3000/${req.file.path.replace("\\", "/")}`;
      user.image = fullUrl;
      await this.userRepository.save(user);

      sendResponse(res, { url: fullUrl }, "Image uploaded successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async updatePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
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

      const user = await this.userRepository.findByIdWithoutRelations(req.user.id);
      if (!user) {
        sendResponse(res, null, "User not found", 404);
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        sendResponse(res, null, "Current password is incorrect", 400);
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      sendResponse(res, null, "Password updated successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findByIdWithoutRelations(Number(id));
      if (!user) {
        sendResponse(res, null, "User not found", 404);
        return;
      }

      if (user.image) {
        const imagePath = path.join(__dirname, "../", user.image.replace("http://localhost:3000/", ""));
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Failed to delete user image:", err);
          });
        }
      }

      await this.userRepository.delete(Number(id));
      sendResponse(res, null, "User deleted successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }
}

export default new UserService();