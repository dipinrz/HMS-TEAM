import Joi from "joi";
import { Gender } from "../entities/user.entity";

export const email = Joi.string()
    .email()
    .required()
    .messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be valid",
        "any.required": "Email cannot be null",
    })


export const password = Joi.string()
    .min(6)
    .required()
    .messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password cannot be null",
    })


export const userDetailsSchema = {
    first_name: Joi.string().min(2),
    last_name: Joi.string().min(1),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.string(),
    date_of_birth: Joi.date(),
    gender: Joi.string()
        .valid(...Object.values(Gender))
        .messages({
            "any.only": `Gender must be one of [${Object.values(Gender).join(", ")}]`,
        }),
}