import express from "express";
import { 
  deleteUser, 
  getUser, 
  getUsers, 
  updateProfile, 
  getProfile, 
  updatePassword 
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";
import { validateUpdatePassword, updateUser } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/profile", authenticate, getProfile);

router.get("/", authenticate, adminMiddleware, getUsers);
router.get("/:id", authenticate, adminMiddleware, getUser);

router.put("/profile", authenticate, updateUser, updateProfile);

router.put("/update-password", authenticate, validateUpdatePassword, updatePassword);

router.delete("/:id", authenticate, adminMiddleware, deleteUser);

export default router;