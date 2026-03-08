import express from 'express';
import { container } from '../../infrastructure/container.js';
import { waypointController } from '../controllers/waypointController.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = waypointController(container.waypointService);

router
    .post('/', validateUUID('mapId'), controller.createWaypoint)
    .post('/bulk', validateUUID('mapId'), controller.createMultipleWaypoints)
    .get('/', validateUUID('mapId'), controller.getAllWaypoints)
    .get('/:id', validateUUID('mapId'), validateUUID('id'), controller.getWaypointById)
    .put('/:id', validateUUID('mapId'), validateUUID('id'), controller.updateWaypoint)
    .delete('/:id', validateUUID('mapId'), validateUUID('id'), controller.deleteWaypoint);
    
export default router;