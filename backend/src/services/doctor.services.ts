import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Doctor } from "../entities/doctor.entity";

const doctorRepo = AppDataSource.getRepository(Doctor)
const appointmentRepo = AppDataSource.getRepository(Appointment)


export const createDoctor = async (doctor: Partial<Doctor>) => {

    const newDoctor = doctorRepo.create(doctor)

    return await doctorRepo.save(newDoctor)
}



export const getDoctorById = async (doctorId: number) => {
    return await doctorRepo.findOne({
        where: {
            doctor_id: doctorId
        },
        relations: ['user']
    })
}


export const getDoctorAppointments = async (doctorId: number) => {

    return await appointmentRepo.find({
        where: {
            doctor: { user_id: doctorId }
        },
        relations: ['patient']
    })
