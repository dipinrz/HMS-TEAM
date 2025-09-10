import express from 'express';
import { fetchNotification } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
const notificationRoutes = express.Router();

notificationRoutes.get('/', authenticate, fetchNotification);

export default notificationRoutes;