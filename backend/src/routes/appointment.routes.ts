import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { addAppointment, cancelAppointmentHandler, fetchAllAppointmentsHandler, fetchAppointmentByIdHandler } from '../controllers/appointment.controller';
import { UserRole } from '../entities/user.entity';

const appointmentRoutes = express.Router();

appointmentRoutes.use(authenticate);

appointmentRoutes.post('/', authorize(UserRole.PATIENT), addAppointment);
appointmentRoutes.delete('/:appointmentId', authorize(UserRole.PATIENT), cancelAppointmentHandler);
appointmentRoutes.get('/', authorize(UserRole.ADMIN), fetchAllAppointmentsHandler);
appointmentRoutes.get('/:appointmentId', authorize(UserRole.ADMIN, UserRole.PATIENT), fetchAppointmentByIdHandler);


export default appointmentRoutes;