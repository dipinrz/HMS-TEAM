import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Doctor } from "../entities/doctor.entity";

const doctorRepo = AppDataSource.getRepository(Doctor)
const appointmentRepo = AppDataSource.getRepository(Appointment)


export const createDoctor = async (doctor_id: number, doctor: Partial<Doctor>) => {

    const newDoctor = doctorRepo.create(doctor)

    return await doctorRepo.save(newDoctor)
}

export const getDoctorById = async (doctor_id: number) => {
    return await doctorRepo.findOneBy({ doctor_id })
}


export const getDoctorAppointments = async (doctor_id: number) => {

    return await appointmentRepo.find({
        where: {
            doctor: { user_id: doctor_id }
        },
        relations:['patient']
    })
}