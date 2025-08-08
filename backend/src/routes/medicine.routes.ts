import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';
import { createMedicine, deleteMedicine, fetchAllMedicines } from '../controllers/medicine.controller';

const medicineRoutes = express.Router()
medicineRoutes.use(authenticate);

medicineRoutes.post('/create',authorize(UserRole.ADMIN),createMedicine)
medicineRoutes.get('/fetchAll',authorize(UserRole.ADMIN),fetchAllMedicines)
medicineRoutes.delete('/delete/:id',authorize(UserRole.ADMIN),deleteMedicine)



export default medicineRoutes