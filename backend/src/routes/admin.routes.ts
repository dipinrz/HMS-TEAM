import express from 'express';
import { deleteUser, fetchAllUsers, registerDoctor, updateUserDetails } from '../controllers/admin.controller';
import { validateBody } from '../middlewares/body.validator.middleware';
import { updateUserSchema } from '../validations/user.validations';
import { doctorSchema } from '../validations/doctor.validations';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';

const adminRoutes = express.Router();
adminRoutes.use(authenticate)

adminRoutes.get('/all', authorize(UserRole.ADMIN), fetchAllUsers);
adminRoutes.post('/update/:userId', authorize(UserRole.ADMIN), validateBody(updateUserSchema), updateUserDetails);
adminRoutes.delete('/delete/:userId', authorize(UserRole.ADMIN), deleteUser);
adminRoutes.post('/register-doctor', authorize(UserRole.ADMIN), validateBody(doctorSchema), registerDoctor);

export default adminRoutes;