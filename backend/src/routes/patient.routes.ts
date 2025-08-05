
import express from 'express'
import { getAllPatientsHandler, getAppointmentsHandler, getPatientByIdHandler, updatePatientHandler } from '../controllers/patient.controllers'
import { authenticate } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/body.validator.middleware'
import { updatePatientSchema } from '../validations/patient.validations'


const router = express.Router()


router.route("/")
    .get(getAllPatientsHandler)

router.route("/appointments")
    .get(authenticate, getAppointmentsHandler)

router.route("/:patientId")
    .get(authenticate, getPatientByIdHandler)

router.route('/update')
    .patch(authenticate, validateBody(updatePatientSchema), updatePatientHandler)


export default router