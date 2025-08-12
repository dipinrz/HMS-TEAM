import express from 'express';
import { addDepartmentHandler, fetchAllDepartmentHandler, getDoctorsByDepartmentHandler, removeDepartmentHandler, updateDepartmentHandler } from '../controllers/department.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/body.validator.middleware';
import { departmentSchema, updateDepartmentSchema } from '../validations/department.validations';
import { UserRole } from '../entities/user.entity';

const departmentRoutes = express.Router();
departmentRoutes.use(authenticate);

departmentRoutes.get('/', authorize(UserRole.ADMIN), fetchAllDepartmentHandler);
departmentRoutes.post('/', authorize(UserRole.ADMIN), validateBody(departmentSchema), addDepartmentHandler);
departmentRoutes.delete('/:departmentId', authorize(UserRole.ADMIN), removeDepartmentHandler);
departmentRoutes.post('/update/:departmentId', authorize(UserRole.ADMIN), validateBody(updateDepartmentSchema), updateDepartmentHandler);
departmentRoutes.get('/doctors/:departmentId', authorize(UserRole.ADMIN, UserRole.PATIENT), getDoctorsByDepartmentHandler);

export default departmentRoutes;