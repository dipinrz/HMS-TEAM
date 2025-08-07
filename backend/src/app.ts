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

dotenv.config();

const app = express();

app.use(cors());
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




app.use(errorHandler)




export default app;
