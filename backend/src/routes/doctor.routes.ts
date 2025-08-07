
import express from 'express'
import { getDoctorAppointmentsHandler, getDoctorPatientsHandler } from '../controllers/doctor.controllers'
import { authenticate } from '../middlewares/auth.middleware'

const router = express.Router()


router.route("/appointments")
    .get(authenticate, getDoctorAppointmentsHandler);

router.route("/patients/:doctor_id")
    .get(authenticate, getDoctorPatientsHandler);



export default router