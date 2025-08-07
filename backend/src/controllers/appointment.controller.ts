import { Request, Response, NextFunction } from "express";
import { AppointmentStatus } from "../entities/appointment.entity";
import { PaymentStatus } from "../entities/bill.entity";
import { getUserById } from "../services/user.services";
import { getDepartmentById } from "../services/department.services";
import { getMedicalReportByPId } from "../services/medicalReport.services";
import { ApiError } from "../utils/apiError";
import { createAppointment, deleteAppointmentById, getAllAppointments, getAppointmentById, getScheduledAppointmentById, isAppointmentExistsSameDay } from "../services/appointment.services";
import { createBill, deleteBillById, getBillByAppointmentId } from "../services/bill.services";
import { createBillItem } from "../services/billItem.services";
import { FeeType } from "../entities/billItem.entity";
import { appointmentQuerySchema } from "../validations/appointment.validations";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const addAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const patient_id = req.user.userId;

    try {
        const {
            doctor_id,
            department_id,
            appointment_date,
            status = AppointmentStatus.SCHEDULED,
            reason_for_visit,
            notes,
        } = req.body;

        const patient = await getUserById(patient_id);
        const doctor = await getUserById(doctor_id);
        const department = await getDepartmentById(department_id);
        const medicalReport = await getMedicalReportByPId(patient_id);

        if (!patient) throw new ApiError("Patient not found", 404);
        if (!doctor) throw new ApiError("Doctor not found", 404);
        if (!department) throw new ApiError("Department not found", 404);
        if (!medicalReport) throw new ApiError("Medical report not found", 404);

        const exists = await isAppointmentExistsSameDay(doctor_id, patient_id, new Date(appointment_date));
        if (exists) {
        throw new ApiError("An appointment already exists for this doctor and patient on the same day", 409);
        }

        const appointment = await createAppointment({
            patient,
            doctor,
            department,
            appointment_date,
            medical_report_id: medicalReport,
            status,
            reason_for_visit,
            notes,
        });

        const consultationFee = Number(department.consultation_fee);
        const tax = parseFloat((consultationFee * 0.18).toFixed(2));
        const total = parseFloat((consultationFee + tax).toFixed(2));

        const bill = await createBill({
            patient,
            appointment,
            tax_amount: tax,
            total_amount: total,
            paid_amount: 0,
            payment_status: PaymentStatus.UNPAID,
        });

        const bill_item = await createBillItem({
            bill,
            fee_type: FeeType.CONSULTATION_FEE,
            amount: consultationFee,
        });

        const bill_amount = bill_item.amount

        res.status(201).json({
        success: true,
        message: "Appointment and bill created successfully",
        data: { bill, bill_amount },
        });
    } catch (error) {
        next(error);
    }
};

export const cancelAppointmentHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const appointmentId = Number(req.params.appointmentId);

        if (isNaN(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }

        const appointment = await getScheduledAppointmentById(appointmentId);

        if(!appointment){
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await deleteAppointmentById(appointmentId); 
        const bill = await getBillByAppointmentId(appointmentId);
        
        await deleteBillById(bill.bill_id)

        return res.status(200).json({
            success: true,
            message: "Appointment and bill deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}

export const fetchAllAppointmentsHandler = async (req: Request, res: Response, next: NextFunction) => {

    try{
        
        const validatedQuery = await appointmentQuerySchema.validateAsync(req.query);

        const filter: any = {};
        if (validatedQuery.status) {
            filter.status = validatedQuery.status;
        }

        const appointmentData = await getAllAppointments(filter);

        if(!appointmentData){
            throw new ApiError('Appointments not found', 404)
        }

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: {
                appointments: appointmentData
            }
        });

    } catch(error) {
        next(error);
    }
}

export const fetchAppointmentByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const appointment_id = Number(req.params.appointmentId);

         if (isNaN(appointment_id)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }
        
        const appointment = await getAppointmentById(appointment_id);

        if(!appointment){
            throw new ApiError('Appointment not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Appointment fetched successfully',
            data: {
                appointment
            }
        })

    } catch(error){
        next(error);
    }

}