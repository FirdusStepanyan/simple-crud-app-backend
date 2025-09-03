import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";
import timeSlotController from "../controllers/timeSlot.controller";

const router = express.Router();

router.post("/", authenticate, adminMiddleware, timeSlotController.create);

router.get("/All", authenticate, timeSlotController.getAll);

router.get("/:id", authenticate, timeSlotController.getById);

router.put("/:id", authenticate, adminMiddleware, timeSlotController.update);

router.delete("/:id", authenticate, adminMiddleware, timeSlotController.delete);

export default router;
