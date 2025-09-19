
import express from 'express'
import { forgotPassword, loginUser, refreshToken, registerPatient, resetPassword, sendOTP, verifyOTP, } from '../controllers/auth.controller'
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validations/auth.validations'
import { validateBody } from '../middlewares/body.validator.middleware'

const router = express.Router()


router.route("/register/patient")
    .post(validateBody(registerSchema), registerPatient)

router.route("/login")
    .post(validateBody(loginSchema), loginUser)

router.route("/refresh-token")
    .post(refreshToken)


router.route("/forgot-password")
    .post(validateBody(forgotPasswordSchema), forgotPassword)

router.route("/reset-password")
    .post(validateBody(resetPasswordSchema), resetPassword)

router.route("/send-otp").post(sendOTP)

router.route("/verify-otp").post(verifyOTP)


export default router