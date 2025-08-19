
import express from 'express'
import { addPrescription, getPatientPrescription, getPatientPrescriptions, getPrescriptionByAppointmentIdHandler } from '../controllers/prescription.controller'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { UserRole } from '../entities/user.entity'
import { createPrescriptionSchema } from '../validations/prescription.validations'
import { validateBody } from '../middlewares/body.validator.middleware'


const router = express.Router()

router.route("/")
    .post(authenticate, authorize(UserRole.ADMIN, UserRole.DOCTOR), addPrescription)


router.route('/patient/:patientId')
    .get(authenticate, authorize(UserRole.ADMIN, UserRole.DOCTOR), getPatientPrescriptions)

router.route("/:prescriptionId")
    .get(authenticate, authorize(UserRole.ADMIN, UserRole.DOCTOR), getPatientPrescription)

router.route('/appointment/:appointmentId')
.get(authenticate, getPrescriptionByAppointmentIdHandler)

export default router