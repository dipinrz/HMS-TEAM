import { Router } from 'express';
import { createRazorpayOrder, getAllPaymentHistory, getMonthWiseBilling, getPaymentById, getPaymentHistorybyPatientHandler, verifyRazorpayPayment } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';

const paymentRoutes = Router();
paymentRoutes.use(authenticate)

paymentRoutes.post('/create-order', authorize(UserRole.PATIENT, UserRole.ADMIN), createRazorpayOrder);
paymentRoutes.post('/verify', authorize(UserRole.PATIENT, UserRole.ADMIN), verifyRazorpayPayment);
paymentRoutes.get('/monthly', authorize(UserRole.ADMIN), getMonthWiseBilling);
paymentRoutes.get('/history/user', authorize(UserRole.PATIENT), getPaymentHistorybyPatientHandler);
paymentRoutes.get('/allPayments',authorize(UserRole.ADMIN),getAllPaymentHistory)
paymentRoutes.get('/payment/:id',authorize(UserRole.ADMIN),getPaymentById)


export default paymentRoutes;
