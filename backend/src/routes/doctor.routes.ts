
import express from 'express'
import { getDoctorAppointmentsHandler, getDoctorPatientsHandler, getDoctorProfile, updateDoctorProfile } from '../controllers/doctor.controllers'
import { authenticate } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/body.validator.middleware';
import { doctorSchema } from '../validations/doctor.validations';

const router = express.Router()


router.route("/appointments")
    .get(authenticate, getDoctorAppointmentsHandler);

router.route("/patients/:doctor_id")
    .get(authenticate, getDoctorPatientsHandler);

router.get('/getProfile',authenticate,getDoctorProfile)
router.patch('/update',authenticate, updateDoctorProfile)



export default router