import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';
import { createMedicine, deleteMedicine, fetchAllMedicines, fetchAllMedicinesForDoctors, updateMedicineHandler } from '../controllers/medicine.controller';

const medicineRoutes = express.Router()
medicineRoutes.use(authenticate);

medicineRoutes.post('/create',authorize(UserRole.ADMIN),createMedicine)
medicineRoutes.get('/fetchAll',authorize(UserRole.ADMIN, UserRole.DOCTOR),fetchAllMedicines)
medicineRoutes.get('/fetchAll/doctors',authorize(UserRole.ADMIN, UserRole.DOCTOR),fetchAllMedicinesForDoctors)
medicineRoutes.delete('/delete/:id',authorize(UserRole.ADMIN),deleteMedicine);
medicineRoutes.post('/update/:medicineId', authorize(UserRole.ADMIN), updateMedicineHandler);


export default medicineRoutes