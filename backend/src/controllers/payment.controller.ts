import { Request, Response, NextFunction } from 'express';
import { createOrder, fetchPaymentByIdService, getAllPayments, getMonthlyRevenue, getPaymentHistoryByPatientId, verifySignature } from '../services/payment.services';
import { razorpay } from '../config/razorpay';
import { getBillById, markBillAsPaid } from '../services/bill.services';
import { ApiError } from '../utils/apiError';
import { Payment } from '../entities/payment.entity';
import { AuthRequest } from './doctor.controller';
import { instanceToPlain } from 'class-transformer';

export const createRazorpayOrder = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const order = await createOrder(amount);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (err) {
        next(err);
    }
};


export const verifyRazorpayPayment = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount_paid,
        bill_id
        } = req.body;

        const bill = await getBillById(bill_id);
        
        if(!bill){
            throw new ApiError('Bill not found', 404);
        }

        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        
        const paymentData = {
            payment_method: payment.method,
            email: payment.email,
            contact: String(payment.contact),
            amount_paid: amount_paid/100,
            bill_id: bill_id
        }

        const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentData);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const billPaid = await markBillAsPaid(bill);

        if(!billPaid){
            throw new ApiError('Failed to mark as paid', 404);
        }

        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        next(err);
    }
};

export const getMonthWiseBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await getMonthlyRevenue();

        if (!payments.length) {
        throw new ApiError("Payment data not found", 404);
        }

        const monthlyData = payments.reduce((acc, payment) => {
        const date = new Date(payment.payment_date);
        const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!acc[monthKey]) {
            acc[monthKey] = {
            month: monthKey,
            total_amount: 0,
            payments: [],
            };
        }

        acc[monthKey].total_amount += Number(payment.amount_paid);
        acc[monthKey].payments.push(payment);

        return acc;
        }, {} as Record<string, { month: string; total_amount: number; payments: Payment[] }>);

        const result = Object.values(monthlyData).sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );

        res.status(200).json({
        success: true,
        message: "Monthly revenue fetched successfully",
        data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentHistorybyPatientHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const patient_id = req.user.userId;

        const payment_history = await getPaymentHistoryByPatientId(patient_id);

        res.status(200).json({
            success: true,
            message: 'Payment history fetched successfully',
            payment_history: instanceToPlain(payment_history)
        })

    } catch (error) {
        next(error);
    }
}

export const getAllPaymentHistory = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const paymentData = await getAllPayments()

        if(!paymentData){
            throw new ApiError ("No bills found",404)
        }
        res.status(200).json({
            message:"All bills fetched successfully",
            paymentData,
            length:paymentData.length
        })
    }catch (error) {
        next(error);
    }
}


export const getPaymentById = async (req:Request,res:Response,next:NextFunction)=>{
    try{    
        const paymentId = req.params.id
        const payment = await fetchPaymentByIdService(Number(paymentId))

        if(!payment){
            throw new ApiError("Bill not found",404)
        }

        res.status(200).json({
            message:"Bill fetched successfully",
            payment
        })

    }catch(error){
        next(error)
    }

}