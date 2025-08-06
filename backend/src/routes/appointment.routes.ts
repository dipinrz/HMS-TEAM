import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { addAppointment } from '../controllers/appointment.controller';

const appointmentRoutes = express.Router();

appointmentRoutes.use(authenticate);

appointmentRoutes.post('/', authorize('patient'), addAppointment);


export default appointmentRoutes;