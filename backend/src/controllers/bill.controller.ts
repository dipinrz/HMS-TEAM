import { NextFunction, Response } from "express";
import { AuthRequest } from "./doctor.controller";
import { getBillsByPatientId } from "../services/bill.services";

export const getPatientBill = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        
        const patient_id = req.user.userId;

        const bills = await getBillsByPatientId(patient_id);

    if (!bills || bills.length === 0) {
      return res.json({
        success: true,
        message: "No bills found",
        bill: [],
      });
    }

    const formattedBills = bills.map((bill) => {
      const total = bill.total_amount;
      const tax = bill.tax_amount;

      return {
        ...bill,
        bill_amount: (total - tax).toFixed(2),
      };
    });
        
    res.json({
        success: true,
        message: 'Bill fetched successfully',
        bills: formattedBills
    })

    } catch (error) {
        next(error)
    }

}