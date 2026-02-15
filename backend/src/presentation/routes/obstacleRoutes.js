import express from 'express';
import { container } from '../../infrastructure/container.js';
import { obstacleController } from '../controllers/obstacleController.js'

const router = express.Router({ mergeParams: true });
const controller = obstacleController(container.obstacleService);

router
    .post('/', controller.createObstacle)
    .post('/bulk', controller.createMultipleObstacles)
    .get('/', controller.getAllObstacles)
    .get('/:id', controller.getObstacleById)
    .put('/:id', controller.updateObstacle)
    .delete('/:id', controller.deleteObstacle);

export default router;
