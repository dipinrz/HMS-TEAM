import express from 'express';
import { fetchNotification, updateStatus } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
const notificationRoutes = express.Router();

notificationRoutes.get('/', authenticate, fetchNotification);
notificationRoutes.put('/update/:notifID',authenticate,updateStatus)
export default notificationRoutes;