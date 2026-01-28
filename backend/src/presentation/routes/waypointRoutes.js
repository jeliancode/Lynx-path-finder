import express from 'express';
import * as waypointController from '../controllers/waypointController.js';

const router = express.Router({ mergeParams: true });

router
    .post('/', waypointController.createWaypoint)
    .post('/bulk', waypointController.createMultipleWaypoints)
    .get('/', waypointController.getAllWaypoints)
    .get('/:id', waypointController.getWaypointById)
    .put('/:id', waypointController.updateWaypoint)
    .delete('/:id', waypointController.deleteWaypoint);
    
export default router;