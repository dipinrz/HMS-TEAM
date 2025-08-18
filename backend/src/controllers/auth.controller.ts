import { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail, getUserById, updateUser } from "../services/user.services";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";
import bcrypt from 'bcryptjs'
import { generateAccessToken, generatePassordResetToken, generateRefreshToken, verifyPassordResetToken, verifyRefreshToken } from "../utils/token";
import { generateResetPasswordEmail } from "../helper/emailTemplates/resetPassword";
import { sendEmail } from "../utils/email";
import jwt from 'jsonwebtoken'
import { createPatient } from "../services/patient.services";
import { createMedicalReport } from "../services/medicalReport.services";


export const registerPatient = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { first_name, last_name, email, password } = req.body


        const userExisting = await getUserByEmail(email)

        if (userExisting) {
            throw new ApiError("Email already in use", 401)
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const user = await createUser({
            first_name,
            last_name,
            email,
            password: hashedpassword,
            role: UserRole.PATIENT
        })



        await createPatient({
            user
        })

        await createMedicalReport({ patient: user })

        delete user.password

        res.status(201).json({
            success: true,
            message: `Patient registered successfully`,
            user,
        });

    } catch (error) {
        next(error)
    }

}


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password } = req.body

        const user = await getUserByEmail(email)

        if (!user) {
            throw new ApiError("Email doesn't exist", 401)
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new ApiError("Invalid credentials", 401)
        }
        const payload = {
            userId: user.user_id,
            role: user.role
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })

        delete user.password;


        res.status(200).json({
            success: true,

            message: "Login successful",
            accessToken,
            user
        })

    } catch (error) {
        next(error)
    }
}


export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.refreshToken



        if (!token) {
            throw new ApiError("Refresh token missing", 400)
        }

        const decoded = verifyRefreshToken(token)


        if (!decoded || typeof decoded === "string" || !decoded.userId || !decoded.role) {
            throw new ApiError("Invalid or expired invite token", 401);
        }
        const payload = {
            userId: decoded.userId,
            role: decoded.role
        }

        const accessToken = generateAccessToken(payload)

        res.status(200).json({
            success: true,
            message: "New access token created successfully",
            accessToken,
        })

    } catch (error) {
        next(error)
    }
}


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {

        console.log(req.body);

        const { email } = req.body;
        console.log(email);



        const user = await getUserByEmail(email)

        if (!user) {
            throw new ApiError("User doesn't exist", 404)
        }

        const payload = {
            user_id: user.user_id
        }

        const token = generatePassordResetToken(payload, user.password)

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        console.log('Frontend URL:', process.env.FRONTEND_URL);


        const html = generateResetPasswordEmail(`${user.first_name + " " + user.last_name}`, resetLink)

        await sendEmail(
            user.email,
            'Reset Your Password - HMS',
            html.toString(),
            html
        )
        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        })



    } catch (error) {
        next(error)
    }
}


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token, password } = req.body
        

        const decoded = jwt.decode(token);
        

        if (!decoded || typeof decoded === "string" || !decoded.user_id) {
            throw new ApiError("Invalid or expired invite token", 401);
        }

        const user = await getUserById(decoded.user_id)

        if (!user) {
            throw new ApiError("User not found", 400)
        }


        verifyPassordResetToken(token, user.password)

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword

        await updateUser(user.user_id, user)



        res.status(200).json({
            success: true,
            status: 200,
            message: "Password reset successful",
        });



    } catch (error) {
        next(error)
    }

}