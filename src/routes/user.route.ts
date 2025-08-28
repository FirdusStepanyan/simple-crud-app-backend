import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";
import { validateUser } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getUsers);   // 👈 auth check
router.get("/:id", authenticate, getUser);
router.put("/:id", authenticate, validateUser, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;