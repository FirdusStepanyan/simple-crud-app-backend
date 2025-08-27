import express from "express";
import { registration, login } from "../controllers/auth.controller";
import { validateUser, loginUser } from "../middlewares/validation.middleware";

const router = express.Router();

router.post("/registration", validateUser, registration);
router.post("/login", loginUser, login);

 export default router;