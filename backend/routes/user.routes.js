import { Router } from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import userController, { updateProfile } from '../controllers/user.controller.js';

const router = Router();

// Update daily goal (protected)
router.put('/me/goal', authUser, userController.updateDailyGoal);
router.put('/me', authUser, updateProfile);

export default router;

