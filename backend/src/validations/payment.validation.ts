import Joi from 'joi';

export const createPaymentSchema = Joi.object({
    
    bill_id: Joi.number()
        .required()
        .messages({
        'any.required': 'Bill ID is required',
        'number.base': 'Bill ID must be a number',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email format',
        }),

    contact: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
        'any.required': 'Contact number is required',
        'string.pattern.base': 'Invalid Indian phone number',
        }),

    amount_paid: Joi.number()
        .required()
        .messages({
        'any.required': 'Amount paid is required',
        'number.base': 'Amount paid must be a number',
        }),

    payment_method: Joi.string()
        .max(100)
        .required()
        .messages({
        'any.required': 'Payment method is required',
        'string.base': 'Payment method must be a string',
        'string.max': 'Payment method must be at most 100 characters',
        }),

    transaction_id: Joi.string()
        .max(255)
        .required()
        .messages({
        'any.required': 'Transaction ID is required',
        'string.max': 'Transaction ID must be at most 255 characters',
        }),

    razorpay_order_id: Joi.string()
        .max(255)
        .optional()
        .allow(null, '')
        .messages({
        'string.max': 'Razorpay order ID must be at most 255 characters',
        }),

    razorpay_signature: Joi.string()
        .max(255)
        .optional()
        .allow(null, '')
        .messages({
        'string.max': 'Razorpay signature must be at most 255 characters',
        }),

    verified: Joi.boolean()
        .optional()
        .messages({
        'boolean.base': 'Verified must be a boolean value',
        }),
});