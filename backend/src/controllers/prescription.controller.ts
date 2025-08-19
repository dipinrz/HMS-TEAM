import { Request, Response, NextFunction } from "express";
import {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatientId,
} from "../services/prescription.services";
import { ApiError } from "../utils/apiError";
import { getPatientById } from "../services/patient.services";
import { getMedicinesByIds } from "../services/medicine.services";
import {
  createManyMedications,
  getMedicinesOfPrescription,
} from "../services/medication.services";
import {
  getAppointmentById,
  updateAppointmentStatus,
} from "../services/appointment.services";
import { AppointmentStatus } from "../entities/appointment.entity";
import {
  getBillByAppointmentId,
  getBillsByPatientId,
  updateBillById,
} from "../services/bill.services";
import { createBillItem } from "../services/billItem.services";
import { FeeType } from "../entities/billItem.entity";
import { getPrescriptionsByAppoinment } from "../services/medicalReport.services";

export const addPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointment_id, medications, diagnosis } = req.body;

    const appointment = await getAppointmentById(appointment_id);

    if (!appointment) {
      throw new ApiError("Appointment ID doesn't exist", 404);
    }

    const medicineIds = medications.map((m: any) => m.medicine_id);
    const foundMedicines = await getMedicinesByIds(medicineIds);

    if (foundMedicines.length !== medicineIds.length) {
      const foundIds = foundMedicines.map((m) => m.medicine_id);
      const invalidIds = medicineIds.filter(
        (id: number) => !foundIds.includes(id)
      );
      throw new ApiError(`Invalid medicine IDs: ${invalidIds.join(", ")}`, 400);
    }

    const prescription = await createPrescription({
      appointment,
      diagnosis,
    });

    const newMedicationsData = medications.map((m: any) => {
      const medicine = foundMedicines.find(
        (med) => med.medicine_id === m.medicine_id
      );

      return {
        prescription,
        medicine,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions,
      };
    });

    const newMedications = await createManyMedications(newMedicationsData);

    prescription.appointment = appointment;

    const bill = await getBillByAppointmentId(appointment_id);

    let totalAmount = 0;
    for (const med of newMedications) {
      let amount = med.duration * med.frequency * med.medicine.cost;

      totalAmount += amount;
      await createBillItem({
        bill,
        medication: med,
        fee_type: FeeType.MEDICATION_FEE,
        amount,
      });
    }
    const tax = parseFloat((totalAmount * 0.18).toFixed(2));

    totalAmount += tax;

    const updatedTotal = Number(bill.total_amount) + totalAmount;
    const updatedTax = Number(bill.tax_amount) + tax;

    await updateBillById(bill.bill_id, {
      total_amount: updatedTotal,
      tax_amount: updatedTax,
    });

    res.status(200).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
      medications: newMedications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppoinmentStatus = async (req: Request, res: Response) => {
  try {
    const { appointment_id } = req.body;
    const appointment = await getAppointmentById(appointment_id);

    if (!appointment) {
      throw new ApiError("Appointment ID doesn't exist", 404);
    }

    await updateAppointmentStatus(appointment_id, AppointmentStatus.COMPLETED);
    appointment.status = AppointmentStatus.COMPLETED;
    

    res.status(201).json({
        success:true,
        message:"Appointment status updated to completed"
    })
  } catch (error) {
    console.log("Error in updateAppoinmentStatus", error);
  }
};

export const getPatientPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prescriptionId } = req.params;
    const prescription = await getPrescriptionById(Number(prescriptionId));

    if (!prescription) {
      throw new ApiError("Prescription not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Prescription fetched successfully",
      prescription,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientPrescriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params;

    const patient = await getPatientById(Number(patientId));

    if (!patient) {
      throw new ApiError("Patient not found", 404);
    }

    const prescriptions = await getPrescriptionsByPatientId(Number(patientId));

    res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByAppointmentIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment_id = Number(req.params.appointmentId);

    const prescriptions = await getPrescriptionsByAppoinment(appointment_id);

    if (!prescriptions) {
      throw new ApiError("Prescription not found", 404);
    }

    const prescriptionsWithMedicines = await Promise.all(
      prescriptions.map(async (prescription) => {
        const medicines = await getMedicinesOfPrescription(
          prescription.prescription_id
        );
        return {
          ...prescription,
          medicines,
        };
      })
    );

    res.json({
      success: true,
      message: "Prescription fetched successfully",
      prescriptions: prescriptionsWithMedicines,
    });
  } catch (error) {
    next(error);
  }
};
