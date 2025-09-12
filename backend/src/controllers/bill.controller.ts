  import { NextFunction, Response } from "express";
  import { AuthRequest } from "./doctor.controller";
  import { getBillsByPatientId } from "../services/bill.services";
  import { getBillItemBybillId } from "../services/billItem.services";
  import { Bill } from "../entities/bill.entity";

  // export const getPatientBill = async (
  //   req: AuthRequest,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const patient_id = req.user.userId;
  //     const { isPaid } = req.query;

  //     let bills;

  //     if (isPaid === "true") {
  //       bills = await getBillsByPatientId(patient_id, true);
  //     } else if (isPaid === "false") {
  //       bills = await getBillsByPatientId(patient_id, false);
  //     } else {
  //       bills = await getBillsByPatientId(patient_id);
  //     }

  //     if (!bills || bills.length === 0) {
  //       return res.json({
  //         success: true,
  //         message: "No bills found",
  //         bill: [],
  //       });
  //     }

  //     const formattedBills = await Promise.all(
  //       bills.map(async (bill: Bill) => {
  //         const total = bill.total_amount;
  //         const tax = bill.tax_amount;
  //         const billitem = await getBillItemBybillId(bill.bill_id);

  //         return {
  //           ...bill,
  //           bill_amount: (total - tax).toFixed(2),
  //           billitem,
  //         };
  //       })
  //     );

  //     res.json({
  //       success: true,
  //       message: "Bill fetched successfully",
  //       bills: formattedBills,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };


  export const getPatientBill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient_id = req.user.userId;
    const { isPaid } = req.query;

    // convert isPaid query param to boolean
    let paidFilter: boolean | undefined;
    if (isPaid === "true") paidFilter = true;
    else if (isPaid === "false") paidFilter = false;

    // Fetch all bills
    const allBills = await getBillsByPatientId(patient_id, paidFilter);

    // Fetch consultation bills
    const consultationBills = await getBillsByPatientId(
      patient_id,
      paidFilter,
      "consultation"
    );

    // Fetch medication bills
    const medicationBills = await getBillsByPatientId(
      patient_id,
      paidFilter,
      "medication"
    );

    // Helper to format bills with items
    const formatBills = async (bills: Bill[]) =>
      Promise.all(
        bills.map(async (bill) => {
          const billItems = await getBillItemBybillId(bill.bill_id);
          return {
            ...bill,
            bill_amount: (bill.total_amount - bill.tax_amount).toFixed(2),
            billItems,
          };
        })
      );

    const formattedAllBills = await formatBills(allBills);
    const formattedConsultationBills = await formatBills(consultationBills);
    const formattedMedicationBills = await formatBills(medicationBills);

    res.json({
      success: true,
      message: "Bills fetched successfully",
      allBills: formattedAllBills,
      consultationBills: formattedConsultationBills,
      medicationBills: formattedMedicationBills,
    });
  } catch (error) {
    next(error);
  }
};
