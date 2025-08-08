import { Request, Response, NextFunction } from "express";
import {
  getDoctorAppointments,
  getDoctorById,
  getPatientsByDoctorId,
  updateDoctorById,
} from "../services/doctor.services";
import dayjs from "dayjs";
import { ApiError } from "../utils/apiError";
import { updateUser } from "../services/user.services";
import { instanceToPlain } from "class-transformer";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const getDoctorAppointmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const { date, from, to, today } = req.query;

    let dateRange: { from: string; to: string } | undefined;
    console.log(req.query);

    if (today === "true") {
      const start = dayjs().startOf("day").toISOString();
      const end = dayjs().endOf("day").toISOString();
      dateRange = { from: start, to: end };
    } else if (date) {
      const start = dayjs(date as string)
        .startOf("day")
        .toISOString();
      const end = dayjs(date as string)
        .endOf("day")
        .toISOString();
      dateRange = { from: start, to: end };
    } else if (from && to) {
      dateRange = {
        from: dayjs(from as string)
          .startOf("day")
          .toISOString(),
        to: dayjs(to as string)
          .endOf("day")
          .toISOString(),
      };
    }

    const appointments = await getDoctorAppointments(user.userId, dateRange);

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorPatientsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const doctorId = Number(req.params.doctor_id);

  try {
    const patients = await getPatientsByDoctorId(doctorId);

    if (!patients) {
      throw new ApiError("Patients not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: {
        patient_count: patients.length,
        patients,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor_id = req.user.userId;
    console.log(doctor_id);
    const response = await getDoctorById(Number(doctor_id));
    if (!response) {
      throw new ApiError("Doctor not found", 404);
    }
    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor_id = req.user.userId;
    console.log(doctor_id);
    const response = await getDoctorById(Number(doctor_id));
    if (!response) {
      throw new ApiError("Doctor not found", 404);
    }
    const {
            first_name,
            last_name,
            email,
            phone_number,
            address,
            gender,
            date_of_birth,
            specialization,
            qualification,
            license_number,
            years_of_experience,
            department_id  
        } = req.body;   
  

         const updatedUserFields = {
            first_name,
            last_name,
            email,
            phone_number,
            address,
            gender,
            date_of_birth,
        };

        const updatedDoctorFields = {
             specialization,
            qualification,
            license_number,
            years_of_experience,
            department_id  
        };

        await updateUser(doctor_id, updatedUserFields)

        const updatedDoctor = await updateDoctorById(doctor_id, updatedDoctorFields)
        console.log(updatedDoctor)
        
                res.status(200).json({
                    success: true,
                    updatedDoctor: instanceToPlain(updatedDoctor)
                }) 
        


  } catch (error) {
    next(error);
  }
};
