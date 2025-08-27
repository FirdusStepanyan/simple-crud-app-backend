import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";
import { validateUser } from "../middlewares/validation.middleware";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", validateUser, updateUser);
router.delete("/:id", deleteUser);

export default router;