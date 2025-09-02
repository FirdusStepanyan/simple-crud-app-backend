import express from "express";
import multer from "multer";
import { 
  deleteUser, getUser, getUsers, updateProfile, getProfile, updatePassword,
  uplaodProfileImage
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.midddleware";
import { validateUpdatePassword, updateUser } from "../middlewares/validation.middleware";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: (arg0: null, arg1: string) => any) => cb(null, "src/uploads/"),
  filename: (_req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-");
  },
});
const upload = multer({ storage });

router.get("/profile", authenticate, getProfile);
router.get("/", authenticate, adminMiddleware, getUsers);
router.get("/:id", authenticate, adminMiddleware, getUser);
router.put("/profile", authenticate, updateUser, updateProfile);
router.put("/update-password", authenticate, validateUpdatePassword, updatePassword);
router.delete("/:id", authenticate, adminMiddleware, deleteUser);
router.post("/upload-image", authenticate, upload.single("image"), uplaodProfileImage);
  
export default router;
