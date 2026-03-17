import { Router } from 'express';
import { getCourseBySlug, getCourses } from '../controllers/courses.controller';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:slug', getCourseBySlug);

export default router;

