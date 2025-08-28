import express from "express";
import { registration, login, emailverifi } from "../controllers/auth.controller";
import { validateUser, loginUser, validateverificode } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/registration", validateUser, registration);
router.post("/login", loginUser, login);
router.post("/verify",validateverificode, authenticate,  emailverifi);

export default router;