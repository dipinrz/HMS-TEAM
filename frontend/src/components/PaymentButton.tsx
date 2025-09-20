import React from 'react';
import axios from 'axios';
import CustomButton from './ui/CustomButton';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { createOrder } from '../services/paymentAPI';

type VerifyResponse = {
    success: boolean;
    message: string;
};


const accessTokenString = localStorage.getItem('authUser');
let token = ''

if (accessTokenString) {
    const authUser = JSON.parse(accessTokenString);
    token = authUser.token;
    console.log(token)
}


interface BillPropType {
    billAmount: number,
    billId: number,
    onPaymentSuccess: () => void,

}


const PaymentButton: React.FC<BillPropType> = ({ billAmount, billId, onPaymentSuccess }) => {

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const { user } = useAuthStore();


    const handlePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); 

        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const orderResponse = await createOrder(billAmount);

            const { orderId, amount, currency } = orderResponse.data;
            console.log("this is the current amount: ", amount);
            console.log("bill Amount:  ", billAmount);

            console.log("bill id is : ", billId);
            console.log("Order response:", orderResponse.data);




            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'My App',
                description: 'Test Transaction',
                order_id: orderId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async function (response: any) {
                    const data = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bill_id: billId,
                        amount_paid: amount,

                    };

                    // 2. Send verification request to backend
                    const verifyRes = await axios.post<VerifyResponse>(`${import.meta.env.VITE_BASE_URL}/payment/verify`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (verifyRes.data.success) {
                        onPaymentSuccess();
                        toast.success("Payment Completed")


                    } else {
                        toast.error("Payment Failed");
                    }
                },
                prefill: {
                    name: user?.first_name, 
                    email: user?.email,
                    contact: user?.phone_number,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const razor = new (window as any).Razorpay(options);
            razor.open();

        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again later.');
        }
    };



    return (
        <CustomButton
            label='Pay'
            variant='contained'
            sx={{ bgcolor: 'green', margin: '5px' }}
            onClick={handlePayment} />
    );
};

export default PaymentButton;
