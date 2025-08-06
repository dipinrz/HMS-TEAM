import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { addAppointment, cancelAppointmentHandler, fetchAllAppointmentsHandler, fetchAppointmentByIdHandler } from '../controllers/appointment.controller';

const appointmentRoutes = express.Router();

appointmentRoutes.use(authenticate);

appointmentRoutes.post('/', authorize('patient'), addAppointment);
appointmentRoutes.delete('/:appointmentId', authorize('patient'), cancelAppointmentHandler);
appointmentRoutes.get('/', authorize('admin'), fetchAllAppointmentsHandler);
appointmentRoutes.get('/:appointmentId', authorize('admin', 'patient'), fetchAppointmentByIdHandler);


export default appointmentRoutes;