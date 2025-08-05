
import express from 'express'
import { forgotPassword, loginUser, refreshToken, registerUser, resetPassword, } from '../controllers/auth.controllers'
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validations/auth.validations'
import { validateBody } from '../middlewares/body.validator.middleware'

const router = express.Router()


router.route("/register/:role")
    .post(validateBody(registerSchema), registerUser)

router.route("/login")
    .post(validateBody(loginSchema), loginUser)

router.route("/refresh-token")
    .post(refreshToken)


router.route("/forgot-password")
    .post(validateBody(forgotPasswordSchema), forgotPassword)

router.route("/reset-password")
    .post(validateBody(resetPasswordSchema), resetPassword)



export default router