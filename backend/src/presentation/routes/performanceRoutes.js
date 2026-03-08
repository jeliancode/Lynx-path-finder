import express from 'express';
import { performanceController } from '../controllers/performanceController.js';
import { container } from '../../infrastructure/container.js';

const router = express.Router({ mergeParams: true });
const controller = performanceController(container.performanceService);

router.post('/analyze', controller.analyzeRoutePerformance);

export default router;