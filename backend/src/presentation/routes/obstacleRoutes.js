import express from 'express';
import { container } from '../../infrastructure/container.js';
import { obstacleController } from '../controllers/obstacleController.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = obstacleController(container.obstacleService);

router
    .post('/', validateUUID('mapId'), controller.createObstacle)
    .post('/bulk', validateUUID('mapId'), controller.createMultipleObstacles)
    .get('/', validateUUID('mapId'), controller.getAllObstacles)
    .get('/:id', validateUUID('mapId'), validateUUID('id'), controller.getObstacleById)
    .put('/:id', validateUUID('mapId'), validateUUID('id'), controller.updateObstacle)
    .delete('/:id', validateUUID('mapId'), validateUUID('id'), controller.deleteObstacle);

export default router;
