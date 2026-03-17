import { Router } from 'express';
import { enroll } from '../controllers/enroll.controller';

const router = Router();

router.post('/enroll', enroll);

export default router;

