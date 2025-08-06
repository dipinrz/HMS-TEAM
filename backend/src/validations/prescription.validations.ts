import Joi from "joi";


export const createPrescriptionSchema = Joi.object({
    appointment_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Appointment ID is required",
            "number.positive": "Appointment ID must be a positive number",
            "number.base": "Appointment ID must be a number",
        }),

    diagnosis: Joi.string()
        .min(5)
        .required()
        .messages({
            "any.required": "Diagnosis is required",
            "string.empty": "Diagnosis cannot be empty",
            "string.base": "Diagnosis must be a string",
            "string.min": "Diagnosis should be at least 5 characters",
        }),
    medications: Joi.array()
        .items(
            Joi.object({
                medicine_id: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "any.required": "Medicine ID is required",
                        "number.positive": "Medicine ID must be a positive number",
                        "number.base": "Medicine ID must be a number",
                    }),
                dosage: Joi.string().required().messages({
                    "any.required": "Dosage is required",
                }),

                frequency: Joi.string().required().messages({
                    "any.required": "Frequency is required",
                }),

                duration: Joi.string().required().messages({
                    "any.required": "Duration is required",
                }),

                instructions: Joi.string().allow("").optional(),

            })
        )
})