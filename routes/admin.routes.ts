import { Router } from 'express';
import { createCourse, deleteCourse, getEnrollments, updateCourse } from '../controllers/admin.controller';
import { requireAdmin } from './admin.middleware';

const router = Router();

router.use(requireAdmin);

router.get('/admin/enrollments', getEnrollments);
router.post('/admin/courses', createCourse);
router.put('/admin/courses/:id', updateCourse);
router.delete('/admin/courses/:id', deleteCourse);

export default router;

