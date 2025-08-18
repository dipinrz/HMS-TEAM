import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { addAppointment, cancelAppointmentHandler, fetchAllAppointmentsHandler, fetchAppointmentByIdHandler, fetchTodaysAppoinments } from '../controllers/appointment.controller';
import { UserRole } from '../entities/user.entity';
import { validateBody } from '../middlewares/body.validator.middleware';
import { appointmentSchema } from '../validations/appointment.validations';

const appointmentRoutes = express.Router();

appointmentRoutes.use(authenticate);

appointmentRoutes.post('/', authorize(UserRole.PATIENT), validateBody(appointmentSchema), addAppointment);
appointmentRoutes.delete('/:appointmentId', authorize(UserRole.PATIENT), cancelAppointmentHandler);
appointmentRoutes.get('/', authorize(UserRole.ADMIN), fetchAllAppointmentsHandler);
appointmentRoutes.get('/:appointmentId', authorize(UserRole.ADMIN, UserRole.PATIENT,UserRole.DOCTOR), fetchAppointmentByIdHandler);

export default appointmentRoutes;