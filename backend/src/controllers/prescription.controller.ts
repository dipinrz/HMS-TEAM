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
  createBill,
  getBillByAppointmentId,
  getBillsByPatientId,
  updateBillById,
} from "../services/bill.services";
import { createBillItem } from "../services/billItem.services";
import { getPrescriptionsByAppoinment } from "../services/medicalReport.services";
import { request } from "http";
import { BillType, PaymentStatus } from "../entities/bill.entity";
import { FeeType } from "../entities/billItem.entity";

// export const addPrescription = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { appointment_id, medications, diagnosis } = req.body;

//     const appointment = await getAppointmentById(appointment_id);

//     if (!appointment) {
//       throw new ApiError("Appointment ID doesn't exist", 404);
//     }

//     const appointmentDate = new Date(appointment.appointment_date);
//     const now = new Date();

//     const windowStart = appointmentDate;
//     const windowEnd = new Date(appointmentDate.getTime() + 30 * 60 * 1000); // +30 minutes

//     if (
//       now < windowStart || // before appointment
//       now > windowEnd || // after 30-min window
//       now.toDateString() !== appointmentDate.toDateString()
//     ) {
//       throw new ApiError(
//         "Prescription can only be created during the appointment time slot (within 30 minutes).",
//         400
//       );
//     }

//     const medicineIds = medications.map((m: any) => m.medicine_id);
//     const foundMedicines = await getMedicinesByIds(medicineIds);

//     if (foundMedicines.length !== medicineIds.length) {
//       const foundIds = foundMedicines.map((m) => m.medicine_id);
//       const invalidIds = medicineIds.filter(
//         (id: number) => !foundIds.includes(id)
//       );
//       throw new ApiError(`Invalid medicine IDs: ${invalidIds.join(", ")}`, 400);
//     }

//     const prescription = await createPrescription({
//       appointment,
//       diagnosis,
//     });

//     await updateAppointmentStatus(appointment_id, AppointmentStatus.PROGRESS);
//     appointment.status = AppointmentStatus.PROGRESS;

//     const newMedicationsData = medications.map((m: any) => {
//       const medicine = foundMedicines.find(
//         (med) => med.medicine_id === m.medicine_id
//       );

//       return {
//         prescription,
//         medicine,
//         dosage: m.dosage,
//         frequency: m.frequency,
//         duration: m.duration,
//         instructions: m.instructions,
//       };
//     });

//     const newMedications = await createManyMedications(newMedicationsData);

//     prescription.appointment = appointment;

//     const bill = await getBillByAppointmentId(appointment_id);

//     let totalAmount = 0;
//     for (const med of newMedications) {
//       let amount = med.duration * med.frequency * med.medicine.cost;

//       totalAmount += amount;
//       await createBillItem({
//         bill,
//         medication: med,
//         fee_type: FeeType.MEDICATION_FEE,
//         amount,
//       });
//     }
//     const tax = parseFloat((totalAmount * 0.18).toFixed(2));

//     totalAmount += tax;

//     const updatedTotal = Number(bill.total_amount) + totalAmount;
//     const updatedTax = Number(bill.tax_amount) + tax;

//     await updateBillById(bill.bill_id, {
//       total_amount: updatedTotal,
//       tax_amount: updatedTax,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Prescription created successfully",
//       prescription,
//       medications: newMedications,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const addPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointment_id, medications, diagnosis } = req.body;
    const allowedStatuses = [
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.PROGRESS,
    ];

    const appointment = await getAppointmentById(appointment_id);
    if (!appointment) throw new ApiError("Appointment ID doesn't exist", 404);

    if (!allowedStatuses.includes(appointment.status)) {
      throw new ApiError(
        "Prescription can only be added for appointments that are SCHEDULED (consultation paid).",
        400
      );
    }
    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();
    const windowEnd = new Date(appointmentDate.getTime() + 30 * 60 * 1000);

    if (
      now < appointmentDate ||
      now > windowEnd ||
      now.toDateString() !== appointmentDate.toDateString()
    ) {
      throw new ApiError(
        "Prescription can only be created during the appointment time slot (within 30 minutes).",
        400
      );
    }

    // 1️⃣ Validate medications
    const medicineIds = medications.map((m: any) => m.medicine_id);
    const foundMedicines = await getMedicinesByIds(medicineIds);
    if (foundMedicines.length !== medicineIds.length) {
      const invalidIds = medicineIds.filter(
        (id: number) => !foundMedicines.some((m) => m.medicine_id === id)
      );
      throw new ApiError(`Invalid medicine IDs: ${invalidIds.join(", ")}`, 400);
    }

    // 2️⃣ Create prescription
    const prescription = await createPrescription({ appointment, diagnosis });
    await updateAppointmentStatus(appointment_id, AppointmentStatus.PROGRESS);
    appointment.status = AppointmentStatus.PROGRESS;

    // 3️⃣ Create medication records
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

    // 4️⃣ Create separate medication bill
    const medTotalAmount = newMedications.reduce(
      (acc, med) => acc + med.duration * med.frequency * med.medicine.cost,
      0
    );
    const medTax = parseFloat((medTotalAmount * 0.18).toFixed(2));
    const medicationBill = await createBill({
      patient: appointment.patient,
      appointment,
      bill_type: BillType.MEDICATION,
      total_amount: medTotalAmount + medTax,
      tax_amount: medTax,
      payment_status: PaymentStatus.UNPAID,
    });

    // 5️⃣ Add bill items for medications
    for (const med of newMedications) {
      const amount = med.duration * med.frequency * med.medicine.cost;
      await createBillItem({
        bill: medicationBill,
        medication: med,
        fee_type: FeeType.MEDICATION_FEE,
        amount,
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription and medication bill created successfully",
      prescription,
      medication_bill: medicationBill,
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

    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();

    const windowStart = appointmentDate;
    const windowEnd = new Date(appointmentDate.getTime() + 30 * 60 * 1000);

    if (now < windowStart || now > windowEnd) {
      throw new ApiError(
        "Status can only be updated during the appointment time slot (within 30 minutes of start).",
        400
      );
    }

    const prescriptions = await getPrescriptionsByAppoinment(appointment_id);

    if (prescriptions.length == 0) {
      throw new ApiError(
        "Status cannot be updated without adding prescription"
      );
    }

    await updateAppointmentStatus(appointment_id, AppointmentStatus.COMPLETED);
    appointment.status = AppointmentStatus.COMPLETED;

    res.status(200).json({
      success: true,
      message: "Appointment status updated to completed",
    });
  } catch (error) {
    console.error("Error in updateAppoinmentStatus", error);
    res.status(500).json({ success: false, message: error.message });
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

    res.status(201).json({
      success: true,
      message: "Prescription fetched successfully",
      prescriptions: prescriptionsWithMedicines,
    });
  } catch (error) {
    next(error);
  }
};
