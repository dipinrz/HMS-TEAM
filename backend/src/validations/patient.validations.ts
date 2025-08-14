import Joi from "joi";
import { userDetailsSchema } from "./commonFields";


export const updatePatientSchema = Joi.object({

    ...userDetailsSchema,

    blood_group: Joi.string().max(3),
    height: Joi.number().min(2),
    weight: Joi.number().min(0),

    allergies: Joi.string().min(2),
    medical_history: Joi.string().min(2),
    date_of_birth: Joi.date()
        .iso()
        .less('now')
        .messages({
            'date.base': 'Date of birth must be a valid date',
            'date.less': 'Date of birth cannot be in the future',
            'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)'
        }),


})