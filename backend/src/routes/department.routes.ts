import express from 'express';
import { addDepartmentHandler, fetchAllDepartmentHandler, removeDepartmentHandler, updateDepartmentHandler } from '../controllers/department.controller';
import { authorize } from '../middlewares/auth.middlware';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/body.validator.middleware';
import { departmentSchema } from '../validations/department.validations';

const departmentRoutes = express.Router();
departmentRoutes.use(authenticate);

departmentRoutes.get('/', authorize('admin'), fetchAllDepartmentHandler);
departmentRoutes.post('/', authorize('admin'), validateBody(departmentSchema), addDepartmentHandler);
departmentRoutes.delete('/:id', authorize('admin'), removeDepartmentHandler);
departmentRoutes.post('/update/:id', authorize('admin'), updateDepartmentHandler);

export default departmentRoutes;