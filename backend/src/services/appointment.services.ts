import { AppDataSource } from "../config/data-source";
import { Appointment, AppointmentStatus } from "../entities/appointment.entity";
import { Between } from 'typeorm';

const appointmentRepo = AppDataSource.getRepository(Appointment);

export const createAppointment = async (appointment: Partial<Appointment>) => {

    const newAppointment = appointmentRepo.create(appointment);

    return await appointmentRepo.save(newAppointment);
}

export const isAppointmentExistsSameDay = async (doctor_id: number, patient_id: number, appointmentDate: Date): Promise<boolean> => {

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await appointmentRepo.findOne({
        where: {
<<<<<<< Updated upstream
            doctor: { user_id: doctor_id },
            patient: { user_id: patient_id },
            appointment_date: Between(startOfDay, endOfDay),
=======
        doctor: { user_id: doctor_id },
        patient: { user_id: patient_id },
        appointment_date: Between(startOfDay, endOfDay),
        status: AppointmentStatus.SCHEDULED
>>>>>>> Stashed changes
        },
    });

    return !!existingAppointment;
};

<<<<<<< Updated upstream

export const getAppointmentById = async (appointmentId: number) => {

    return await appointmentRepo.findOne({
        where: {
            appointment_id: appointmentId
        },
    })
}

export const updateAppointmentStatus = async (appointmentId: number, status: AppointmentStatus) => {

    await appointmentRepo.update(
        { appointment_id: appointmentId },
        { status }
    )

}
=======
export const getAppointmentById = async (id: number) => {

    return await appointmentRepo.findOneBy({ appointment_id: id })
}

export const getScheduledAppointmentById = async (id: number) => {

    return await appointmentRepo.findOneBy({ appointment_id: id, status: AppointmentStatus.SCHEDULED })
}

export const deleteAppointmentById = async (id: number) => {

    return await appointmentRepo.update({ appointment_id: id }, {status: AppointmentStatus.CANCELLED});
};

export const updateAppointmentById = async (id: number, data: Partial<Appointment>) => {

    await appointmentRepo.update({ appointment_id: id }, data);

    return await appointmentRepo.findOneBy({ appointment_id: id });
};

export const getAllAppointments = async (filter: any = {}) => {

    return await appointmentRepo.find({
        where: filter,
        relations: ['doctor', 'patient', 'department', 'medical_report_id'],
        order: {
            appointment_date: 'DESC'
        }
    });
};
>>>>>>> Stashed changes
