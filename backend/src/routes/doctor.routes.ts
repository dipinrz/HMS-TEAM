
import express from 'express'
import { getDoctorAppointmentsHandler } from '../controllers/doctor.controllers'
import { authenticate } from '../middlewares/auth.middleware'

const router = express.Router()


router.route("/appointments")
    .get(authenticate, getDoctorAppointmentsHandler)



export default router