import Joi from 'joi';

export const departmentSchema = Joi.object({

    name: Joi.string().trim().required().messages({
        'any.required': 'Department name is required',
        'string.empty': 'Department name cannot be empty',
    }),

    description: Joi.string().trim().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be empty',
    }),

    consultation_fee: Joi.number().precision(2).positive().required().messages({
        'any.required': 'Consultation fee is required',
        'number.base': 'Consultation fee must be a number',
        'number.positive': 'Consultation fee must be positive',
    }),

    head_doctor: Joi.number().optional().allow(null).messages({
        'number.base': 'Head doctor must be a valid doctor ID or null',
    }),

});

export const updateDepartmentSchema = Joi.object({

    name: Joi.string().trim().optional().messages({
        'string.empty': 'Department name cannot be empty',
    }),

    description: Joi.string().trim().optional().messages({
        'string.empty': 'Description cannot be empty',
    }),

    consultation_fee: Joi.number().precision(2).positive().optional().messages({
        'number.base': 'Consultation fee must be a number',
        'number.positive': 'Consultation fee must be positive',
    }),

    head_doctor: Joi.number().optional().allow(null).messages({
        'number.base': 'Head doctor must be a valid doctor ID or null',
    }),

});
