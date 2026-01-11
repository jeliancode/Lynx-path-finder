import express from 'express';
import * as obstacleController from '../controllers/obstacleController.js'

const router = express.Router();

router
    .post('/', obstacleController.createObstacle)
    .post('/bulk', obstacleController.createMultipleObstacles)
    .get('/', obstacleController.getAllObstacles)
    .get('/:id', obstacleController.getObstacleById)
    .put('/:id', obstacleController.updateObstacle)
    .delete('/:id', obstacleController.deleteObstacle);

export default router;
