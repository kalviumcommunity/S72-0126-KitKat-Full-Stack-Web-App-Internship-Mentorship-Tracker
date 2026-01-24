import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

// Health check endpoints
router.get('/', healthController.getHealth);
router.get('/ready', healthController.getReadiness);
router.get('/live', healthController.getLiveness);

export default router;