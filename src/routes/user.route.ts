import express from "express";
import { deleteUser, getUser, getUsers, updateUser, getProfile } from "../controllers/user.controller";
import { validateUser } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";

const router = express.Router();

router.get("/", authenticate, adminMiddleware, getUsers);
router.get("/:id", authenticate, adminMiddleware, getUser);

router.get("/profile", authenticate, getProfile);

router.put("/profile", authenticate, validateUser, updateUser);

router.delete("/:id", authenticate, deleteUser);

export default router;