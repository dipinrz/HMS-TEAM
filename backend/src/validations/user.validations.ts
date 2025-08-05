import Joi from 'joi';

export const updateUserSchema = Joi.object({

    first_name: Joi.string()
        .min(2)
        .messages({
        "string.min": "First name must be at least 2 characters",
        "string.empty": "First name cannot be empty",
        }),

    last_name: Joi.string()
        .min(1)
        .messages({
        "string.min": "Last name must be at least 1 character",
        "string.empty": "Last name cannot be empty",
        }),

    phone_number: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .allow(null)
        .messages({
        "string.pattern.base": "Phone number must be 10–15 digits",
        }),

    address: Joi.string().max(255).allow(null, ''),

    date_of_birth: Joi.date().iso().less('now').allow(null).messages({
        "date.format": "Date of birth must be a valid ISO date",
        "date.less": "Date of birth cannot be in the future",
    }),

    gender: Joi.string()
        .valid('male', 'female', 'other', null)
        .allow(null)
        .messages({
        "any.only": "Gender must be 'male', 'female', or 'other'",
        }),

    role: Joi.string()
        .valid('admin', 'doctor', 'patient')
        .messages({
        "any.only": "Role must be one of admin, doctor, or patient",
        }),

    is_active: Joi.boolean(),

    blood_group: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null)
        .allow(null)
        .messages({
        "any.only": "Invalid blood group format",
        }),

    height: Joi.number()
        .positive()
        .precision(2)
        .allow(null)
        .messages({
        "number.base": "Height must be a number",
        "number.positive": "Height must be a positive value",
        }),

    weight: Joi.number()
        .positive()
        .precision(2)
        .allow(null)
        .messages({
        "number.base": "Weight must be a number",
        "number.positive": "Weight must be a positive value",
        }),

    allergies: Joi.string()
        .allow(null, '')
        .messages({
        "string.base": "Allergies must be a string",
        }),

    medical_history: Joi.string()
        .allow(null, '')
        .messages({
        "string.base": "Medical history must be a string",
        }),

    specialization: Joi.string()
        .allow(null, '')
        .messages({
        "string.base": "Specialization must be a string",
        }),

    qualification: Joi.string()
        .allow(null, '')
        .messages({
        "string.base": "Qualification must be a string",
        }),

    license_number: Joi.string()
        .allow(null, '')
        .messages({
        "string.base": "License number must be a string",
        }),

    years_of_experience: Joi.number()
        .integer()
        .min(0)
        .allow(null)
        .messages({
        "number.base": "Years of experience must be a number",
        "number.integer": "Years of experience must be an integer",
        "number.min": "Years of experience cannot be negative",
        }),

    department_id: Joi.number()
        .optional()
        .allow(null)
        .messages({
        "number.base": "Department ID must be a number",
        }),
});
