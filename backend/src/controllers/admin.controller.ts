import { Request, Response, NextFunction } from "express";
import { createUser, deleteUserById, findAllUser, findUserByEmail, findUserById, updateUserById, } from "../services/user.services";
import { UserRole } from "../entities/user.entity";
import { ApiError } from "../utils/apiError";
import bcrypt from "bcryptjs";
import { createDoctor, updateDoctorById } from "../services/doctor.services";

export const fetchAllUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const users = await findAllUser();

        if (!users || users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No users found",
        });
        }

        const patients = users.filter(user => user.role === UserRole.PATIENT);
        const doctors = users.filter(user => user.role === UserRole.DOCTOR);
        const admins = users.filter(user => user.role === UserRole.ADMIN);

        res.status(200).json({
            success: true,
            totalUsers: users.length,
            counts: {
                patients: patients.length,
                doctors: doctors.length,
                admins: admins.length,
            },
            data: {
                patients,
                doctors,
                admins,
            },
        });

    } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({
                success: false,
                message: "Server error while fetching users",
                error: (error as Error).message,
            });
    }
};

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);
        const {
            first_name,
            last_name,
            phone_number,
            address,
            gender,
            date_of_birth,
            blood_group,
            height,
            weight,
            allergies,
            medical_history,
            specialization,
            qualification,
            license_number,
            years_of_experience,
            department_id
        } = req.body;

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const existingUser = await findUserById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cleanObject = (obj: any) => {
            const cleaned: any = {};
            Object.keys(obj).forEach(key => {
                if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                    cleaned[key] = obj[key];
                }
            });
            return cleaned;
        };

        const userFields = cleanObject({
            first_name,
            last_name,
            phone_number,
            address,
            gender,
            date_of_birth,
        });

        const doctorFields = cleanObject({
            specialization,
            qualification,
            license_number,
            years_of_experience,
            department_id
        });

        const patientFields = cleanObject({
            blood_group,
            height,
            weight,
            allergies,
            medical_history,
        });

        let updatedUser = existingUser;
        let updatedProfileData = null;


        if (Object.keys(userFields).length > 0) {
            updatedUser = await updateUserById(userId, userFields);
        }


        if (existingUser.role === 'doctor' && Object.keys(doctorFields).length > 0) {
            updatedProfileData = await updateDoctorById(userId, doctorFields);
        } else if (existingUser.role === 'patient' && Object.keys(patientFields).length > 0) {
            updatedProfileData = await updateDoctorById(userId, doctorFields);
        }

        const hasUserUpdates = Object.keys(userFields).length > 0;
        const hasProfileUpdates = (existingUser.role === 'doctor' && Object.keys(doctorFields).length > 0) ||
                                 (existingUser.role === 'patient' && Object.keys(patientFields).length > 0);

        if (!hasUserUpdates && !hasProfileUpdates) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user: updatedUser,
                profile: updatedProfileData
            },
        });

    } catch (error) {
        console.error('Update user details error:', error);
        next(error);
    }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await deleteUserById(userId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
       next(error);
    }
};


export const registerDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            specialization,
            qualification,
            license_number,
            years_of_experience
        } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new ApiError('Email already in use', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: UserRole.DOCTOR,
        });
        
        const doctorData = {
            doctor_id: user.user_id,
            specialization,
            qualification,
            license_number,
            years_of_experience
        }

        const doctor = await createDoctor(doctorData);

        delete user.password;

        res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            user,
            doctor,
        });
    } catch (error) {
        next(error);
    }
};