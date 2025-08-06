
import express from 'express'
import { getAllPatientsHandler, getAppointmentsHandler, getMyPrescriptions, getPatientByIdHandler, updatePatientHandler } from '../controllers/patient.controllers'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/body.validator.middleware'
import { updatePatientSchema } from '../validations/patient.validations'
import { UserRole } from '../entities/user.entity'


const router = express.Router()


router.route("/")
    .get(getAllPatientsHandler)

router.route("/appointments")
    .get(authenticate, getAppointmentsHandler)


router.route('/update')
    .patch(authenticate, validateBody(updatePatientSchema), updatePatientHandler)

router.route("/prescriptions")
    .get(authenticate, getMyPrescriptions)

router.route("/:patientId")
    .get(authenticate, authorize(UserRole.ADMIN, UserRole.DOCTOR), getPatientByIdHandler)

export default router