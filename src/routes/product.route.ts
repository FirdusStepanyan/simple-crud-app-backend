import express from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { validateProduct, } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { requireVerifiedEmail } from "../middlewares/verifi.middleware";

interface AuthRequest extends Request {
    user?: any// { id: number }; // simplest way
}

const router = express.Router();

// router.get("/", authenticate,  (req: AuthRequest, res) => getProducts(req, res));
router.get("/", authenticate, requireVerifiedEmail, getProducts); // staff ev admin
router.get("/:id", authenticate, requireVerifiedEmail,  getProduct);
router.post("/", authenticate, validateProduct, requireVerifiedEmail,  createProduct);
router.put("/:id", authenticate, validateProduct, requireVerifiedEmail,  updateProduct);
router.delete("/:id", authenticate, requireVerifiedEmail,  deleteProduct);


export default router;