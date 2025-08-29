import express from "express";
import { registration, login, emailverifi } from "../controllers/auth.controller";
import { registerUser, loginUser, validateVerifiCode } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/registration", registerUser, registration);
router.post("/login", loginUser, login);
router.post("/verify",validateVerifiCode, authenticate,  emailverifi);

export default router;