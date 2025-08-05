import Joi from "joi";
import { email, password } from "./commonFields";

export const doctorSchema = Joi.object({

    first_name: Joi.string()
        .min(2)
        .required()
        .messages({
            "string.min": "First name must be atleast 2 characters",
            "string.empty": "First name cannot be empty",
            "any.required": "First name cannot be null",
        }),


    last_name: Joi.string()
        .min(1)
        .required()
        .messages({
            "string.min": "Last name must be atleast 2 characters",
            "string.empty": "Last name cannot be empty",
            "any.required": "Last name cannot be null",
        }),

    email: email,
    password: password,

    specialization: Joi.string()
    .min(1)
    .required()
    .messages({
        "any.required": "specialization cannot be null"
    }),

    qualification: Joi.string()
    .min(1)
    .required()
    .messages({
        "any.required": "qualification cannot be null"
    }),

    license_number: Joi.string()
    .min(1)
    .required()
    .messages({
        "any.required": "license_number cannot be null"
    }),

    years_of_experience: Joi.number()
    .min(1)
    .required()
    .messages({
        "any.required": "years_of_experience cannot be null"
    }),

    department_id: Joi.number()
    .optional()
    .allow(null)
    .messages({
        'number.base': 'Department ID must be a number',
    })

})