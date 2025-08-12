import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Prescription } from "../entities/prescription.entity";


const prescriptionRepo = AppDataSource.getRepository(Prescription)


export const createPrescription = async (prescription: Partial<Prescription>) => {

    const newPrescription = prescriptionRepo.create(prescription)

    return await prescriptionRepo.save(newPrescription)

}

export const getPrescriptionById = async (prescriptionId: number) => {

    return await prescriptionRepo.findOne({
        where: { prescription_id: prescriptionId },
        relations: ['appointment'],
    })

}


export const getPrescriptionsByPatientId = async (patientId: number) => {

    return await prescriptionRepo.find({
        where: {
            appointment: {
                patient: { user_id: patientId }
            }
        },
        relations: ['appointment'],
        order: {
            prescribed_date: 'DESC'
        }
    })

}

export const getPrescriptionByIds = async (appointmentIds: number[]) => {

    return await prescriptionRepo.find({
        where: {
            appointment: { appointment_id: In(appointmentIds) }
        },
        relations: ['appointment']
    });
}