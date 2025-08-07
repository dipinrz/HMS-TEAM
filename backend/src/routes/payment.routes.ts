import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';

const paymentRoutes = Router();
paymentRoutes.use(authenticate)

paymentRoutes.post('/create-order', authorize(UserRole.PATIENT, UserRole.ADMIN), createRazorpayOrder);
paymentRoutes.post('/verify', authorize(UserRole.PATIENT, UserRole.ADMIN), verifyRazorpayPayment);

export default paymentRoutes;
