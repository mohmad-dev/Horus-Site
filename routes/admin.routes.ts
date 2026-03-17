import { Router } from 'express';
import { createCourse, getEnrollments } from '../controllers/admin.controller';
import { requireAdmin } from './admin.middleware';

const router = Router();

router.use(requireAdmin);

router.get('/admin/enrollments', getEnrollments);
router.post('/admin/courses', createCourse);

export default router;

