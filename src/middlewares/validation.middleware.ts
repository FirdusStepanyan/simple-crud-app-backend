import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// -------------------- User validation --------------------
export const updateUser = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),
    lastname: Joi.string().min(2).max(50).required().messages({
      "any.required": "Lastname is required",
      "string.empty": "Lastname cannot be empty",
    }),
    email: Joi.string().max(50).required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    age: Joi.number().integer().positive().required().messages({
      "any.required": "Age is required",
      "number.base": "Age must be a number",
      "number.positive": "Age must be positive",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};


// -------------------- User validation --------------------
export const registerUser = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),
    lastname: Joi.string().min(2).max(50).required().messages({
      "any.required": "Lastname is required",
      "string.empty": "Lastname cannot be empty",
    }),
    email: Joi.string().max(50).required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().max(50).required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
    age: Joi.number().integer().positive().required().messages({
      "any.required": "Age is required",
      "number.base": "Age must be a number",
      "number.positive": "Age must be positive",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.number().min(0).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};

export const loginUser = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};

export const validateVerifiCode = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    code: Joi.number().required().messages({
      "any.required": "Verification code is required",
      "number.base": "Verification code must be a number",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};

export const validateUpdatePassword = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
      "string.empty": "Current password cannot be empty",
    }),
    newPassword: Joi.string().min(6).max(128).required().messages({
      "any.required": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "string.max": "New password cannot exceed 128 characters",
    }),
    confirmNewPassword: Joi.string().required().valid(Joi.ref("newPassword")).messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm new password is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    return;
  }

  next();
};