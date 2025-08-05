import Joi from "joi";
import { Gender } from "../entities/user.entity";


export const updatePatientSchema = Joi.object({

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



    blood_group: Joi.string().max(3),
    height: Joi.number().min(2),
    weight: Joi.number().min(0),

    allergies: Joi.string().min(2),
    medical_history: Joi.string().min(2),



})