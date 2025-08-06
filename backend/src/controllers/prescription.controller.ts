import { Request, Response, NextFunction } from "express"
import {  getPrescriptionById, getPrescriptionsByPatientId } from "../services/prescription.services"
import { ApiError } from "../utils/apiError"
import { getPatientById } from "../services/patient.services"

export const getPatientPrescription = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { prescriptionId } = req.params
        const prescription = await getPrescriptionById(Number(prescriptionId))

        if (!prescription) {
            throw new ApiError("Prescription not found", 404)

        }


        res.status(200).json({
            success: true,
            message: 'Prescription fetched successfully',
            prescription
        })

    } catch (error) {
        next(error)
    }
}

export const getPatientPrescriptions = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { patientId } = req.params


        const patient = await getPatientById(Number(patientId))

        if (!patient) {
            throw new ApiError("Patient not found", 404)
        }


        const prescriptions = await getPrescriptionsByPatientId(Number(patientId));

        res.status(200).json({
            success: true,
            message: 'Prescriptions fetched successfully',
            prescriptions
        })

    } catch (error) {
        next(error)
    }
}