import express from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { validateProduct, } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
interface AuthRequest extends Request {
    user?: any// { id: number }; // simplest way
}

const router = express.Router();

// router.get("/", authenticate,  (req: AuthRequest, res) => getProducts(req, res));
router.get("/", authenticate, getProducts); // staff ev admin
router.get("/:id", authenticate, getProduct);
router.post("/", authenticate, validateProduct, createProduct);
router.put("/:id", authenticate, validateProduct, updateProduct);
router.delete("/:id", authenticate, deleteProduct);


export default router;
