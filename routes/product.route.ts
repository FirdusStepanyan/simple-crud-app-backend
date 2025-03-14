// import express from "express";
// import { getProducts, getProduct, createProduct, updateProduct, deleteProduct} from "../controllers/product.controller.js";

// const router = express.Router();

// router.get("/", getProducts);
// router.get("/:id", getProduct);
// router.post("/", createProduct);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct );  

// export default router;


//aaaaaaaaaaaaaaaaaaaaaa
import express, { Request, Response } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
