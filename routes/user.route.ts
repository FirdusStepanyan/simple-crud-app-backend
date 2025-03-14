// import express from "express";
// import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";

// const router = express.Router();

// router.get("/", getUsers);
// router.get("/:id", getUser);
// router.post("/", createUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

// export default router;

import express, { Request, Response } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
