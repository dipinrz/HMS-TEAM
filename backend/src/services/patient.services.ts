import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Bill } from "../entities/bill.entity";
import { Patient } from "../entities/patient.entity";


const patientRepo = AppDataSource.getRepository(Patient)
const appointmentRepo = AppDataSource.getRepository(Appointment)
const billRepo = AppDataSource.getRepository(Bill)


export const getPatientById = async (patientId: number) => {

    return await patientRepo.findOne({
        where: {
            patient_id: patientId
        },
        relations: ['user']
    })

}

export const createPatient = async (patient: Partial<Patient>) => {

    const newPatient = patientRepo.create(patient)

    return await patientRepo.save(newPatient)
}

export const updatePatient = async (PatientId: number, updatedPatient: Partial<Patient>) => {
    await patientRepo.update(
        { patient_id: PatientId },
        updatedPatient
    )

    return patientRepo.findOne({
        where: {
            patient_id: PatientId
        },
        relations: ['user']
    })

}

export const getPatientAppointments = async (userId: number) => {

    return await appointmentRepo.find({
        where: {
            patient: { user_id: userId }
        },
        relations: ['doctor', 'department'],
        order: {
            appointment_date: 'DESC'
        }
    })
}

// ----------- GET ALL PATIENTS -----------

export const getPatients = async () => {
    return await patientRepo.find({})

}