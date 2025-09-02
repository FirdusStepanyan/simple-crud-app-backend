import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";
import timeSlotController from "../controllers/timeSlot.controller";

const router = express.Router();

// Admin creates time slot
router.post("/", authenticate, adminMiddleware, timeSlotController.create);

// Get all slots
router.get("/", authenticate, timeSlotController.getAll);

// Get slot by id
router.get("/:id", authenticate, timeSlotController.getById);

// Delete slot
router.delete("/:id", authenticate, adminMiddleware, timeSlotController.delete);

export default router;
