import { AppDataSource } from "../config/data-source";
import { Appointment, AppointmentStatus } from "../entities/appointment.entity";
import { Between, In, Not } from 'typeorm';

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
        doctor: { user_id: doctor_id },
        patient: { user_id: patient_id },
        appointment_date: Between(startOfDay, endOfDay),
        status: AppointmentStatus.INITIATED
        },
    });

    console.log("existingAppointment",existingAppointment )
    return !!existingAppointment;
};

export const anotherAppointmentExistsService = async (
  doctor_id: number,
  appointment_date: Date
) => {
  const newStart = appointment_date;
  const newEnd = new Date(newStart.getTime() + 30 * 60 * 1000); 

  const startOfDay = new Date(newStart);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(newStart);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await appointmentRepo.find({
    where: {
      doctor: { user_id: doctor_id },
      appointment_date: Between(startOfDay, endOfDay),
       status: Not(AppointmentStatus.CANCELLED)
    },
  });

  const conflict = appointments.find((appt) => {
    const existingStart = new Date(appt.appointment_date);
    const existingEnd = new Date(existingStart.getTime() + 30 * 60 * 1000);
    return existingStart < newEnd && existingEnd > newStart;
  });

  return conflict ? true : false;
};

export const anotherAppointmentForUserService = async (
  patientId: number,
  appointmentDate: Date,
  doctorId: number
): Promise<boolean> => {
  const appointmentRepo = AppDataSource.getRepository(Appointment);

  const existingAppointment = await appointmentRepo.findOne({
    where: {
      patient: { user_id: patientId },
      appointment_date: appointmentDate,
       status: Not(AppointmentStatus.CANCELLED)
    },
    relations: ["doctor"],
  });

  if (existingAppointment && existingAppointment.doctor.user_id !== doctorId) {
    return true;
  }

  return false;
};

export const getAppointmentById = async (appointmentId: number) => {

    return await appointmentRepo.findOne({
        where: {
            appointment_id: appointmentId
        },
        relations:['patient']
    })
}

export const updateAppointmentStatus = async (appointmentId: number, status: AppointmentStatus) => {

    await appointmentRepo.update(
        { appointment_id: appointmentId },
        { status }
    )

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


export const getTodayAppoinmentService = async(startOfDay:Date,endOfDay:Date)=>{
        const todaysAppointments = await appointmentRepo.find({
          where: {
            appointment_date: Between(startOfDay, endOfDay),
          },
          relations: ["doctor", "patient",'department', 'medical_report_id'], 
        });
        return todaysAppointments
}