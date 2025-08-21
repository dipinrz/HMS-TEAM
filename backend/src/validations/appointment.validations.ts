import Joi from 'joi';
import { AppointmentStatus } from '../entities/appointment.entity';

export const appointmentSchema = Joi.object({

    doctor_id: Joi.number().required().messages({
        'any.required': 'Doctor ID is required',
        'number.base': 'Doctor ID must be a number',
    }),

    department_id: Joi.number().required().messages({
        'any.required': 'Department ID is required',
        'number.base': 'Department ID must be a number',
    }),

    appointment_date: Joi.date().greater('now').required().messages({
        'any.required': 'Appointment date is required',
        'date.base': 'Appointment date must be a valid date',
        'date.greater': 'Appointment date must be in the future',
    }),

    status: Joi.string()
        .valid(...Object.values(AppointmentStatus))
        .optional()
        .messages({
        'any.only': `Status must be one of ${Object.values(AppointmentStatus).join(', ')}`,
        }),

    reason_for_visit: Joi.string().allow('', null).messages({
        'string.base': 'Reason for visit must be a string',
    }),

    notes: Joi.string().allow('', null).messages({
        'string.base': 'Notes must be a string',
    }),
});

export const appointmentQuerySchema = Joi.object({
    status: Joi.string()
        .valid('scheduled', 'completed', 'cancelled', 'progress')
        .insensitive()
        .optional()
        .messages({
            'any.only': 'Invalid status. Allowed: scheduled, completed, cancelled',
            'string.base': 'Status must be a string',
        }),
});


