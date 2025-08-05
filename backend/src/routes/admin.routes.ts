import express from 'express';
import { deleteUser, fetchAllUsers, registerDoctor, updateUserDetails } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middlware';
import { validateBody } from '../middlewares/body.validator.middleware';
import { updateUserSchema } from '../validations/user.validations';
import { doctorSchema } from '../validations/doctor.validations';

const adminRoutes = express.Router();
adminRoutes.use(authenticate)

adminRoutes.get('/all', authorize('admin'), fetchAllUsers);
adminRoutes.post('/update/:id', authorize('admin'), validateBody(updateUserSchema), updateUserDetails);
adminRoutes.delete('/delete/:id', authorize('admin'), deleteUser);
adminRoutes.post('/register-doctor', authorize('admin'), validateBody(doctorSchema), registerDoctor);

export default adminRoutes;