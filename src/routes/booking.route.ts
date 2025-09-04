import { Router, Request, Response, NextFunction } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// CRUD routes
router.post("/create", authenticate, asyncHandler(BookingController.create));
router.get("/", authenticate, asyncHandler(BookingController.getAll));
router.get("/:id", authenticate, asyncHandler(BookingController.getById));
router.put("/:id", authenticate, asyncHandler(BookingController.update));
router.delete("/:id", authenticate, asyncHandler(BookingController.delete));

export default router;
