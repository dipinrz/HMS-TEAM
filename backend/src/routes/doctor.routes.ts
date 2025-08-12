
import express from 'express'
import { getAllDoctors, getDoctorAppointmentsHandler, getDoctorPatientsHandler, getDoctorPrescriptionHandler, getDoctorProfile, updateDoctorProfile } from '../controllers/doctor.controllers'
import { authenticate } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/body.validator.middleware';
import { doctorSchema } from '../validations/doctor.validations';

const router = express.Router()


router.route("/appointments")
    .get(authenticate, getDoctorAppointmentsHandler);

    
router.get('/all',authenticate,getAllDoctors)

router.route("/patients/:doctor_id")
    .get(authenticate, getDoctorPatientsHandler);

router.get('/getProfile',authenticate,getDoctorProfile)
router.patch('/update',authenticate,updateDoctorProfile);
router.get('/prescription', authenticate, getDoctorPrescriptionHandler);

export default router