import Joi from "joi";
import { email, password } from "./commonFields";

// export const doctorSchema = Joi.object({

//     first_name: Joi.string()
//         .min(2)
//         .required()
//         .messages({
//             "string.min": "First name must be atleast 2 characters",
//             "string.empty": "First name cannot be empty",
//             "any.required": "First name cannot be null",
//         }),


//     last_name: Joi.string()
//         .min(1)
//         .required()
//         .messages({
//             "string.min": "Last name must be atleast 2 characters",
//             "string.empty": "Last name cannot be empty",
//             "any.required": "Last name cannot be null",
//         }),

//     email: email,
//     password: password,

//     specialization: Joi.string()
//     .min(1)
//     .required()
//     .messages({
//         "any.required": "specialization cannot be null"
//     }),

//     qualification: Joi.string()
//     .min(1)
//     .required()
//     .messages({
//         "any.required": "qualification cannot be null"
//     }),

//     license_number: Joi.string()
//     .min(1)
//     .required()
//     .messages({
//         "any.required": "license_number cannot be null"
//     }),

//     years_of_experience: Joi.number()
//     .min(0)
//     .required()
//     .messages({
//         "any.required": "years_of_experience cannot be null"
//     }),

//     department_id: Joi.number()
//     .optional()
//     .allow(null)
//     .messages({
//         'number.base': 'Department ID must be a number',
//     })

// })

export const doctorSchema = Joi.object({

    first_name: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .min(2)
        .required()
        .messages({
            "string.pattern.base": "First name can only contain alphabets and spaces",
            "string.min": "First name must be at least 2 characters",
            "string.empty": "First name cannot be empty",
            "any.required": "First name cannot be null",
        }),

    last_name: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .min(2)
        .required()
        .messages({
            "string.pattern.base": "Last name can only contain alphabets and spaces",
            "string.min": "Last name must be at least 2 characters",
            "string.empty": "Last name cannot be empty",
            "any.required": "Last name cannot be null",
        }),

    email: email,
    password: password,

    specialization: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .min(1)
        .required()
        .messages({
            "string.pattern.base": "Specialization can only contain alphabets and spaces",
            "any.required": "Specialization cannot be null",
        }),

    qualification: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .min(1)
        .required()
        .messages({
            "string.pattern.base": "Qualification can only contain alphabets and spaces",
            "any.required": "Qualification cannot be null",
        }),

    license_number: Joi.string()
        .pattern(/^[A-Za-z0-9\-]+$/)
        .min(1)
        .required()
        .messages({
            "string.pattern.base": "License number can only contain letters, numbers, and hyphens",
            "any.required": "License number cannot be null",
        }),

    years_of_experience: Joi.number()
        .min(0)
        .required()
        .messages({
            "any.required": "Years of experience cannot be null",
        }),

    department_id: Joi.number()
        .optional()
        .allow(null)
        .messages({
            "number.base": "Department ID must be a number",
        }),

});
