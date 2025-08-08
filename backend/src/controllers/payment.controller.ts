import { Request, Response, NextFunction } from 'express';
import { createOrder, verifySignature } from '../services/payment.services';
import { razorpay } from '../config/razorpay';
import { getBillById, markBillAsPaid } from '../services/bill.services';
import { ApiError } from '../utils/apiError';

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
