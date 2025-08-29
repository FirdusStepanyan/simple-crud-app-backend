import express from "express";
import { deleteUser, getUser, getUsers, updateProfile, getProfile, updatePassword } from "../controllers/user.controller";
import { validateUpdatePassword, validateUser } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";

const router = express.Router();

router.get("/profile", authenticate, getProfile); 
router.get("/", authenticate, adminMiddleware, getUsers);
router.get("/:id", authenticate, adminMiddleware, getUser);
router.put("/profile", authenticate, validateUser, updateProfile);
router.put("/update-password", authenticate,validateUpdatePassword, updatePassword);
router.delete("/:id", authenticate, deleteUser);

export default router;