import express from 'express';
import { addDepartmentHandler, fetchAllDepartmentHandler, removeDepartmentHandler, updateDepartmentHandler } from '../controllers/department.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/body.validator.middleware';
import { departmentSchema, updateDepartmentSchema } from '../validations/department.validations';

const departmentRoutes = express.Router();
departmentRoutes.use(authenticate);

departmentRoutes.get('/', authorize('admin'), fetchAllDepartmentHandler);
departmentRoutes.post('/', authorize('admin'), validateBody(departmentSchema), addDepartmentHandler);
departmentRoutes.delete('/:id', authorize('admin'), removeDepartmentHandler);
departmentRoutes.post('/update/:id', authorize('admin'), validateBody(updateDepartmentSchema), updateDepartmentHandler);

export default departmentRoutes;