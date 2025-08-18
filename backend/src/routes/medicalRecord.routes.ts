import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';
import { fetchPatientMedicalRecordController, fetchPatientMedicalRecordControllerById } from '../controllers/medicalRecord.controller';

const medicalRecordRoutes = express.Router();
medicalRecordRoutes.use(authenticate)

medicalRecordRoutes.get('/',authorize(UserRole.PATIENT),fetchPatientMedicalRecordController);
medicalRecordRoutes.get('/:patient_id', authorize(UserRole.DOCTOR), fetchPatientMedicalRecordControllerById);

export default medicalRecordRoutes