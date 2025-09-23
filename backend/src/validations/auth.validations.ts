import Joi from "joi";
import { email, password } from "./commonFields";

export const registerSchema = Joi.object({
  first_name: Joi.string().min(2).required().messages({
    "string.min": "First name must be atleast 2 characters",
    "string.empty": "First name cannot be empty",
    "any.required": "First name cannot be null",
  }),

  last_name: Joi.string().min(1).required().messages({
    "string.min": "Last name must be atleast 2 characters",
    "string.empty": "Last name cannot be empty",
    "any.required": "Last name cannot be null",
  }),

  email: email,
  password: password,
});

export const loginSchema = Joi.object({
  email: email,
  password: password,
});

export const forgotPasswordSchema = Joi.object({
  email: email,
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token cannot be empty",
    "any.required": "Token cannot be null",
  }),
  password: password,
});
