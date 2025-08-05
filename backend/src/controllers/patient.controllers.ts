import { Request, Response, NextFunction } from "express";
import { createPatient, getPatientById, getPatients, updatePatient } from "../services/patient.services";
import { updateUser } from "../services/user.services";


export const getAllPatientsHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const patients = await getPatients()

        res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            patients
        })

    } catch (error) {
        next(error)
    }
}

export const getPatientByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { patientId } = req.params

        const patient = await getPatientById(Number(patientId))

        res.status(200).json({
            success: true,
            message: "Patient fetched successfully",
            patient
        })

    } catch (error) {
        next(error)
    }
}

export const updatePatientHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = (req as any).user.user_id

        const {
            first_name,
            last_name,
            phone_number,
            address,
            gender,
            date_of_birth,
            blood_group,
            height,
            weight,
            allergies,
            medical_history,
        } = req.body;

        const updatedUserFields = {
            first_name,
            last_name,
            phone_number,
            address,
            gender,
            date_of_birth,
        };

        const updatedPatientFields = {
            blood_group,
            height,
            weight,
            allergies,
            medical_history,
        };

        await updateUser(userId,updatedUserFields)


        const updatedPatient = await updatePatient(userId, updatedPatientFields)


        res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            updatedPatient
        })

    } catch (error) {
        next(error)
    }
}