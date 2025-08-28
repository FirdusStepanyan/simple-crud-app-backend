import { Request, Response, NextFunction } from "express";

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const { name, lastname, age } = req.body;

    if (!name || !lastname || age === undefined) {
        res.status(400).json({ message: "Name, lastname, and age are required" });
        return;
    }

    if (typeof name !== "string" || typeof lastname !== "string") {
        res.status(400).json({ message: "Name and lastname must be strings" });
        return;
    }

    if (typeof age !== "number" || age <= 0) {
        res.status(400).json({ message: "Age must be a positive number" });
        return;
    }

    next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
    const { name, quantity, price} = req.body;

    if (!name || quantity === undefined || price === undefined) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    if (typeof name !== "string") {
        res.status(400).json({ message: "Name must be a string" });
        return;
    }

    if (typeof quantity !== "number" || quantity < 0) {
        res.status(400).json({ message: "Quantity must be a non-negative number" });
        return;
    }

    if (typeof price !== "number" || price < 0) {
        res.status(400).json({ message: "Price must be a non-negative number" });
        return;
    }

    next();
};


export const loginUser = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  next();
};

export const validateverificode = (req: Request, res: Response, next: NextFunction): void => {
  const { code } = req.body;

  if (code == null || code == undefined) {
    res.status(400).json({ message: "code is required" });
    return;
  }
   
  if(typeof code !== "number"){
    res.status(400).json({ message: "code is string, write number" });
    return;
  }

  next();
};