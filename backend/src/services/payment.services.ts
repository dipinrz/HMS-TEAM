import { razorpay } from '../config/razorpay';
import crypto from 'crypto';

export const createOrder = async (amount: number, currency: string = 'INR') => {

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${Date.now()}`,
    };

    return await razorpay.orders.create(options);
    };

    export const verifySignature = (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
    ) => {
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

    return expectedSignature === razorpaySignature;
};
