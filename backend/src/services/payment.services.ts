import { razorpay } from '../config/razorpay';
import crypto from 'crypto';
import { Payment } from '../entities/payment.entity';
import { AppDataSource } from '../config/data-source';
import { Bill } from '../entities/bill.entity';

interface paymentDataType{
    payment_method: string;
    email: string;
    contact: string;
    amount_paid: number;
    bill_id: number;
}

const paymentRepo = AppDataSource.getRepository(Payment);

export const createOrder = async (amount: number, currency: string = 'INR') => {

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${Date.now()}`,
    };

    return await razorpay.orders.create(options);
};

export const verifySignature = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    inputData: paymentDataType
    ) => {
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

    const verified = expectedSignature === razorpaySignature;
    
    const paymentData = {
        bill: { bill_id: inputData.bill_id } as Bill,
        email: inputData.email,
        contact: inputData.contact,
        amount_paid: inputData.amount_paid,
        payment_method: inputData.payment_method,
        transaction_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
        verified: verified
    }

    await createPayment(paymentData);

    if(!verified){
        return false
    }

    return true;
};


export const createPayment = async (paymentData: Partial<Payment>) => {
    
    const newPayment = paymentRepo.create(paymentData);

    return await paymentRepo.save(newPayment);
}