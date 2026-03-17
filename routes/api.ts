import { Router } from 'express';
import coursesRoutes from './courses.routes';
import enrollRoutes from './enroll.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/api', coursesRoutes);
router.use('/api', enrollRoutes);
router.use('/api', adminRoutes);

export default router;

