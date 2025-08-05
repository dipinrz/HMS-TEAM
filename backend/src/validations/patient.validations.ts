import Joi from "joi";
import { userDetailsSchema } from "./commonFields";


export const updatePatientSchema = Joi.object({

    ...userDetailsSchema,
    
    blood_group: Joi.string().max(3),
    height: Joi.number().min(2),
    weight: Joi.number().min(0),

    allergies: Joi.string().min(2),
    medical_history: Joi.string().min(2),



})