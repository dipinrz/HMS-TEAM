import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Bill } from "../entities/bill.entity";
import { Patient } from "../entities/patient.entity";


const patientRepo = AppDataSource.getRepository(Patient)
const appointmentRepo = AppDataSource.getRepository(Appointment)
const billRepo = AppDataSource.getRepository(Bill)


export const getPatientById = async (patient_id: number) => {

    return await patientRepo.findOneBy({ patient_id })

}

export const createPatient = async (patient: Partial<Patient>) => {

    const newPatient = patientRepo.create(patient)

    return await patientRepo.save(newPatient)
}

export const updatePatient = async (patient_id: number, updatedPatient: Partial<Patient>) => {
    await patientRepo.update(
        { patient_id },
        updatedPatient
    )

    return patientRepo.findOneBy({ patient_id })

}

export const getPatientAppointments = async (patient_id: number) => {

    return await appointmentRepo.find({
        where: {
            patient: { user_id: patient_id }
        },
        relations: ['doctor', 'department'],
        order: {
            appointment_date: 'DESC'
        }
    })
}