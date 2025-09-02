import express from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";
import { validateUpdatePassword, updateUser } from "../middlewares/validation.middleware";
import { 
  getUsers, getUser, getProfile, updateProfile, updatePassword, uploadProfileImage, deleteUser
} from "../controllers/user.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "src/uploads/"),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/profile", authenticate, getProfile);
router.get("/", authenticate, adminMiddleware, getUsers);
router.get("/:id", authenticate, adminMiddleware, getUser);
router.put("/profile", authenticate, updateUser, updateProfile);
router.put("/update-password", authenticate, validateUpdatePassword, updatePassword);
router.delete("/:id", authenticate, adminMiddleware, deleteUser);
router.post("/upload-image", authenticate, upload.single("image"), uploadProfileImage);

export default router;
