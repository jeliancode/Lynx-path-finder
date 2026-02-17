import express from 'express';
import { container } from '../../infrastructure/container.js';
import { waypointController } from '../controllers/waypointController.js';

const router = express.Router({ mergeParams: true });
const controller = waypointController(container.waypointService);

router
    .post('/', controller.createWaypoint)
    .post('/bulk', controller.createMultipleWaypoints)
    .get('/', controller.getAllWaypoints)
    .get('/:id', controller.getWaypointById)
    .put('/:id', controller.updateWaypoint)
    .delete('/:id', controller.deleteWaypoint);
    
export default router;