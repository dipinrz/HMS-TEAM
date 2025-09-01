import { Between } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Doctor } from "../entities/doctor.entity";
import { User } from "../entities/user.entity";
import { instanceToPlain } from "class-transformer";
import { Department } from "../entities/department.entity";

const doctorRepo = AppDataSource.getRepository(Doctor)
const appointmentRepo = AppDataSource.getRepository(Appointment);
const departmentRepo = AppDataSource.getRepository(Department);


export const createDoctor = async (doctor: Partial<Doctor>) => {
    console.log(`doctor====================${doctor}`);

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


export const getDoctorAppointments = async (doctorId: number, dateRange?: { from: string; to: string }) => {

    const where: any = {
        doctor: { user_id: doctorId },
    }

    if (dateRange) {
        where.appointment_date = Between(dateRange.from, dateRange.to)

    }
    return await appointmentRepo.find({
        where,
        relations: ['patient'],
        order: {
            appointment_date: 'DESC'
        }
    })
}

export const updateDoctorById = async (id: number, data: Partial<Doctor> & { department_id?: number }) => {
    const { department_id, ...rest } = data;

    const updateData: any = {
        ...rest,
        ...(department_id !== undefined ? { department: { department_id } } : {})
    };

    await doctorRepo.update({ doctor_id: id }, updateData);

    return await doctorRepo.find({
        where: { doctor_id: id },
        relations: ['user', 'department'],
    });
};




export const getPatientsByDoctorId = async (doctorId: number) => {

    const appointments = await appointmentRepo.find({
        where: {
        doctor: { user_id: doctorId }
        },
        relations: ['patient'],
    });

    const uniquePatientsMap = new Map<number, User>();

    for (const appointment of appointments) {
        uniquePatientsMap.set(appointment.patient.user_id, appointment.patient);
    }

    const uniquePatients = Array.from(uniquePatientsMap.values());

    return uniquePatients;
};


export const fetchAllDoctors = async()=>{
    const response = await doctorRepo.find({relations:['department','user'],order:{doctor_id:'ASC'}})
    return instanceToPlain(response)
}

export const findHeadDoctorDepartment = async (head_doctor_id: number) => {

    return await departmentRepo.findOne({ where: {head_doctor: {doctor_id: head_doctor_id} }});
}