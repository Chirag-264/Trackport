import { Router } from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { createDsaProblem, deleteDsaProblem, getDsaProgress, syncLeetCodeSolved, updateDailyProgress } from '../controllers/dsa.controller.js';

const router = Router();
router.use(authUser);
router.get('/', getDsaProgress);
router.put('/daily-progress', updateDailyProgress);
router.post('/leetcode/sync', syncLeetCodeSolved);
router.post('/problems', createDsaProblem);
router.delete('/problems/:id', deleteDsaProblem);

export default router;
