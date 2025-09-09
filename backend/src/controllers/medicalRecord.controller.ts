import { Request, Response, NextFunction } from "express";
import { getPatientById } from "../services/patient.services";
import { ApiError } from "../utils/apiError";
import {
  extractMedicineCourse,
  getAppoinmentsByPatientId,
  getMedicalReportByPId,
  getPrescriptionsByAppoinment,
} from "../services/medicalReport.services";
import app from "../app";

export interface MedicalRequest extends Request {
  user?: { userId: number };
}

export const fetchPatientMedicalRecordController = async (
  req: MedicalRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;

    const patient = await getPatientById(Number(userId));
    if (!patient) {
      throw new ApiError("Patient not found", 404);
    }

    const response = await getMedicalReportByPId(Number(userId));
    if (!response) {
      throw new ApiError("Medical record not found", 404);
    }

    const appointments = await getAppoinmentsByPatientId(Number(userId));
    res.status(201).json({
      success: true,
      message: "Medical record fetched successfully",
      data: {
        medical_report: response,
        appointments,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getPatientMedicineCourse = async (req: MedicalRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;

    const patient = await getPatientById(Number(userId));
    if (!patient) throw new ApiError("Patient not found", 404);

    const medicalReport = await getMedicalReportByPId(Number(userId));
    if (!medicalReport) throw new ApiError("Medical record not found", 404);

    const appointments = await getAppoinmentsByPatientId(Number(userId));


    const medicineCourse = extractMedicineCourse(appointments);

    res.status(200).json({
      success: true,
      message: "Medicine course fetched successfully",
      data: medicineCourse,
    });
  } catch (error) {
    next(error);
  }
};


export const fetchPatientMedicalRecordControllerById = async (
  req: MedicalRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.patient_id);

    const patient = await getPatientById(userId);
    if (!patient) {
      throw new ApiError("Patient not found", 404);
    }

    const response = await getMedicalReportByPId(userId);
    if (!response) {
      throw new ApiError("Medical record not found", 404);
    }

    const appointments = await getAppoinmentsByPatientId(userId);

    res.status(201).json({
      success: true,
      message: "Medical record fetched successfully",
      data: {
        medical_report: response,
        appointments,
      },
    });
  } catch (error) {
    next(error);
  }
};
