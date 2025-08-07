import { Request, Response, NextFunction } from 'express';
import { createOrder, verifySignature } from '../services/payment.services';

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
        } = req.body;

        const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        next(err);
    }
};
