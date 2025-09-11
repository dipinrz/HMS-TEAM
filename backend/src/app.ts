import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from 'cookie-parser'
import patientRoutes from './routes/patient.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from "./routes/admin.routes";
import doctorRoutes from './routes/doctor.routes'
import departmentRoutes from "./routes/department.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import appointmentRoutes from "./routes/appointment.routes";
import paymentRoutes from "./routes/payment.routes";
import medicineRoutes from "./routes/medicine.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";
import billRoutes from "./routes/bill.routes";
import notificationRoutes from "./routes/notification.routes";

dotenv.config();

const app = express();

app.use(cors(
  {
    origin:process.env.FRONTEND_URL
  }
));
app.use(express.json());
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", adminRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use('/api/v1/department', departmentRoutes);
app.use('/api/v1/prescription', prescriptionRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/medicine', medicineRoutes);
app.use('/api/v1/records', medicalRecordRoutes);
app.use('/api/v1/bill', billRoutes);
app.use('/api/v1/notification', notificationRoutes);




app.use(errorHandler)

app.get('/health', (req: any, resp: any) => {
  resp.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
})


export default app;
