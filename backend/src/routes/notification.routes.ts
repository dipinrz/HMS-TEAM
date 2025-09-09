import express from 'express';
import { fetchNotificationDoctor } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
const notificationRoutes = express.Router();

notificationRoutes.get('/doctor/:id', authenticate, fetchNotificationDoctor);

export default notificationRoutes;